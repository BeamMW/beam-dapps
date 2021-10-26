# Shaders-check(work in progress)

## How to use

- Fork or download Shaders-check https://github.com/JenkJS/shaders-check
- Run project on local server.
    - You can use any local server or "serve" https://www.npmjs.com/package/serve 
## How install serve
You must have Node.js installed to run npm packagesВ
   Install serve:
  ``` 
  npm -g serve 
  ```
  or
  ``` 
  yarn -g serve 
  
  ``` 
  
  * Run serve:
  
  ``` 
  serve 
  ```  
   - The server is running

<p align="center">
  <img src="./icons/runServe.png" alt="Serve run"/>
</p>

- In file "setting.ini" which is in the wallet folder at the address:
   - Windows:

```
C:\Users\****\AppData\Local\Beam Wallet Masternet
```
- Add:

```
[devapp]
url=http://localhost:5000 // - your local server
name=<Shaders-check>
```

- Run the wallet in which you added [devapp] in "setting.ini" and in DAPPS Store run the application Shaders-check.

<p align="center">
  <img src="./icons/appRun.png" alt="app run"/>
</p>

- Move to the drag and drop field ".wasm" file  and  and get the result

<p align="center">
  <img src="./icons/appShadRun.png" alt="shader run check"/>
</p>
