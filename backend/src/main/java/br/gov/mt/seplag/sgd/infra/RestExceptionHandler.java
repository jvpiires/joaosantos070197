package br.gov.mt.seplag.sgd.infra;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.bind.MethodArgumentNotValidException;
import java.util.stream.Collectors;

@RestControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler({BadCredentialsException.class, InternalAuthenticationServiceException.class})
    private ResponseEntity<RestErrorMessage> handleLoginError(Exception ex) {
        RestErrorMessage threatResponse = new RestErrorMessage(HttpStatus.UNAUTHORIZED, "Usuário ou senha inválidos");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(threatResponse);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    private ResponseEntity<RestErrorMessage> handleDuplicateUser(UserAlreadyExistsException ex) {
        RestErrorMessage threatResponse = new RestErrorMessage(HttpStatus.CONFLICT, ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(threatResponse);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    private ResponseEntity<RestErrorMessage> handleEntityNotFound(EntityNotFoundException ex) {
        RestErrorMessage threatResponse = new RestErrorMessage(HttpStatus.NOT_FOUND, ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(threatResponse);
    }

    @ExceptionHandler(Exception.class)
    private ResponseEntity<RestErrorMessage> handleGeneral(Exception ex) {
        // ADICIONE ESTA LINHA PARA VER O ERRO NO CONSOLE:
        ex.printStackTrace(); 
        
        RestErrorMessage threatResponse = new RestErrorMessage(HttpStatus.INTERNAL_SERVER_ERROR, "Ocorreu um erro interno no servidor.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(threatResponse);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, 
            org.springframework.http.HttpHeaders headers, 
            org.springframework.http.HttpStatusCode status, 
            org.springframework.web.context.request.WebRequest request) {
        
        String errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.joining("; "));

        RestErrorMessage threatResponse = new RestErrorMessage(HttpStatus.BAD_REQUEST, errors);
        return new ResponseEntity<>(threatResponse, HttpStatus.BAD_REQUEST);
    }

    public record RestErrorMessage(HttpStatus status, String message) {}
}