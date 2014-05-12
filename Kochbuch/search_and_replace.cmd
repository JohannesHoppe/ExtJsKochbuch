@ECHO OFF

%~d0
CD "%~dp0"

rem Changes to the path won't be recognized after installing node via chocolatey
SET PATH=%PATH%;C:\Program Files\nodejs\

echo *** Checking node.js version ***
node -v 2> NUL
if %ERRORLEVEL%==9009 (
  echo *** Error: node.js executable does not exists in path! Going to install it via chocolatey! ***
  CALL "bundle with require optimizer - installation.cmd"
)

echo *** Going to search and replace ***
node search_and_replace.js

pause