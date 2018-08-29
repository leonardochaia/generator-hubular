@echo off

SETLOCAL
SET PATH=node_modules\.bin;node_modules\hubot\node_modules\.bin;%PATH%
SET HUBOT_LOG_LEVEL=debug

@IF EXIST "%~dp0\coffee.exe" (
  "%~dp0\coffee.exe" --nodejs --inspect "%~dp0\..\node_modules\hubot\bin\hubot" --name "<%= botName %>" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  coffee --nodejs --inspect "%~dp0\..\node_modules\hubot\bin\hubot" --name "<%= botName %>" %*
)
