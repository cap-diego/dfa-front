
# Aplicación frontend para minimizar autómatas fínitos determínistico

#### El fw para manipular html y js es [svelte](https://svelte.dev/).
#### Para los estilos usé [tailwind](https://tailwindcss.com/)
#### Para graficar usé [vis.js](https://visjs.github.io/vis-network/docs/network/)
#### El algoritmo que utiliza para minimizar está [acá](https://github.com/cap-diego/dfa-minimization-algorithm)


### Para correr el proyecto localmente una vez clonado:
- npm install, para instalar dependenncias.
- npm run dev, para correr el proyecto con rollup. Ver opciones de puerto en caso de ser necesario.
- npm run build, para buildear la version optimizada para prod.

### Si se necesita utilizar su API
- POST a [lambda function](https://sqbkk9gmb0.execute-api.sa-east-1.amazonaws.com/default/dfa-min-lambda/) con el body en el siguiente formato:
```
  {"states":[0,1],"alphabet":[97],"initialState":1,"finalStates":[0],"delta":{"1":{"97":0}}}
```
- Imortante! Recordar enviar al menos un estado final, caso contrario fallará con 404 y: ```{"message": "Invalid request body"}```
- Como la respuesta también es un autómata el formato es el mismo. Además, contemplar los 'cold starts' de las Lambda.

#### La API tiene restricción de request, para algún en este caso podés enviarme un mensaje privado :smiley:
### La plataforma sobre la cuál está [deployado](https://dfa.diegobuceta.com) es Vercel.



