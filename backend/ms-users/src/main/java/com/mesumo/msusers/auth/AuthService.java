package com.mesumo.msusers.auth;

import com.mesumo.msusers.exceptions.PasswordException;
import com.mesumo.msusers.exceptions.ResourceAlreadyExistsException;
import com.mesumo.msusers.exceptions.ResourceNotFoundException;
import com.mesumo.msusers.jwt.JwtService;
import com.mesumo.msusers.models.entities.Role;
import com.mesumo.msusers.models.entities.User;
import com.mesumo.msusers.models.repository.IUserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final IUserRepository userRepository;

    private final JwtService jwtService;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        String token = jwtService.getToken(user);
        
        return AuthResponse.builder()
                .token(token)
                .build();
    }

    public AuthResponse register(RegisterRequest request) throws ResourceAlreadyExistsException, PasswordException {

        if (request.getPassword().length() < 6 && request.getPassword().length() > 18) {
            throw new PasswordException("Password must be between 6 and 18 characters");
        }

        User user = User.builder()
                .userName(request.getUserName())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .neighborhood(request.getNeighborhood())
                .role(Role.ROLE_USER)
                .build();

        Optional<User> userExists =  userRepository.findByEmail(user.getEmail());
        if(userExists.isPresent()) {
            throw new ResourceAlreadyExistsException(": Cannot finish your registration. User with email: "+ user.getEmail() +" already exists");
        }

        userRepository.save(user);

        return AuthResponse.builder()
                .token(jwtService.getToken(user))
                .build();
    }

    public AuthResponse generateResetPasswordToken(PasswordRequest request) throws ResourceNotFoundException {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        String token = jwtService.getToken(user);
        return AuthResponse.builder()
                .token(token)
                .build();
    }

    public void resetPassword(String token, String password) throws Exception {
        if (!jwtService.isResetTokenValid(token)) {
            throw new IllegalArgumentException("Token inválido o expirado");
        }
        String email = jwtService.getEmailFromToken(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);

    }

}