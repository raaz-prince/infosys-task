package com.taskmanagement.utils;

import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.taskmanagement.exception.LoginFailedException;
import com.taskmanagement.exception.UserAlreadyExistsException;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class ExceptionControllerAdvice {

	@ExceptionHandler(UsernameNotFoundException.class)
	public ResponseEntity<ErrorInfo> usernameNotFoundException(UsernameNotFoundException ex) {

		ErrorInfo errorInfo = new ErrorInfo();
		errorInfo.setErrorMessage(ex.getMessage());
		errorInfo.setErrorCode(HttpStatus.BAD_REQUEST.value());

		return new ResponseEntity<>(errorInfo, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(UserAlreadyExistsException.class)
	public ResponseEntity<ErrorInfo> userAlreadyExistsException(UserAlreadyExistsException ex) {

		ErrorInfo errorInfo = new ErrorInfo();
		errorInfo.setErrorMessage(ex.getMessage());
		errorInfo.setErrorCode(HttpStatus.CONFLICT.value());

		return new ResponseEntity<>(errorInfo, HttpStatus.CONFLICT);
	}

	@ExceptionHandler({ MethodArgumentNotValidException.class, ConstraintViolationException.class })
	public ResponseEntity<ErrorInfo> validatorException(Exception ex) {

		String errorMsg;

		if (ex instanceof MethodArgumentNotValidException) {
			MethodArgumentNotValidException mavnException = (MethodArgumentNotValidException) ex;

			errorMsg = mavnException.getBindingResult().getAllErrors().stream().map(ObjectError::getDefaultMessage)
					.collect(Collectors.joining(", "));
		} else {
			ConstraintViolationException cve = (ConstraintViolationException) ex;

			errorMsg = cve.getConstraintViolations().stream().map(ConstraintViolation::getMessage)
					.collect(Collectors.joining(", "));
		}

		ErrorInfo errorInfo = new ErrorInfo();
		errorInfo.setErrorMessage(errorMsg);
		errorInfo.setErrorCode(HttpStatus.BAD_REQUEST.value());

		return new ResponseEntity<>(errorInfo, HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(LoginFailedException.class)
	public ResponseEntity<ErrorInfo> loginFailed(LoginFailedException ex){
		
		ErrorInfo errorInfo = new ErrorInfo();
		errorInfo.setErrorMessage(ex.getMessage());
		errorInfo.setErrorCode(HttpStatus.UNAUTHORIZED.value());
		return new ResponseEntity<ErrorInfo>(errorInfo, HttpStatus.UNAUTHORIZED);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorInfo> generalException(Exception ex) {

		ErrorInfo errorInfo = new ErrorInfo();
		errorInfo.setErrorMessage(ex.getMessage());
		errorInfo.setErrorCode(HttpStatus.INTERNAL_SERVER_ERROR.value());

		return new ResponseEntity<>(errorInfo, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
