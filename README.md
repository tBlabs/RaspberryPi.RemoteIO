- logi on/off
- problems class - czy apka ma startować bez załadowania plików itp


# Troubleshooting

epoll, pigpio
- run preceding command in node_modules/{problematic library} directory
- sudo node-gyp {action} --target={node version} --verbose
  -- sudo helps (without sudo it tries to use node-gyp from wrong location?)
  -- without target specified it is not working (but it should)
- if there is a problem with /home/pi/.cache/node-gyp try to create this dir manually