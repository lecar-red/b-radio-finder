-- TODO: make readonly user
CREATE USER 'brew_finder'@'localhost' IDENTIFIED BY 'bf';
GRANT ALL PRIVILEGES ON brew_finder.* TO 'brew_finder'@'localhost' 
	WITH GRANT OPTION;
