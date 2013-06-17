-- TODO: make readonly user
CREATE USER 'brew_finder'@'localhost' IDENTIFIED BY 'bf';
GRANT ALL PRIVILEGES ON *.* TO 'brew_finder'@'localhost' 
	WITH GRANT OPTION;
