import Utils from "./utils.js"

export default function parseMethod(obj, name){
    if(typeof(obj)!== Object || obj.length < 0){
        Object.entries(obj).forEach(([key, value])=>{
            const parent = Utils.getById(`${name}`)
            const formRole = document.createElement('from')
            const field = document.createElement('fieldset')
            const fieldName = document.createElement('legend')
            formRole.classList.add(`${key}`)
            fieldName.innerHTML=`${key}`
            parent.append(formRole)
            formRole.append(field)
            field.append(fieldName)
            if(typeof(value === Object)){
                Object.entries(value).forEach(([key, value])=>{
                    const formMethod = document.createElement('form')
                    const fieldMethod = document.createElement('fieldset')
                    const NameMethod = document.createElement('legend')
                    const buttonMethod = document.createElement('button')
                    formMethod.classList.add(`${key}`)
                    buttonMethod.classList.add(`${key}`)
                    buttonMethod.id = `${key}`
                    fieldMethod.classList.add(`${key}`)
                    NameMethod.innerHTML = `${key}`
                    buttonMethod.innerHTML = `${key}`
                    field.append(formMethod)
                    formMethod.append(fieldMethod)
                    fieldMethod.append(NameMethod)
                    fieldMethod.append(buttonMethod))
                    if(typeof(value === Object)){
                        Object.entries(value).forEach(([key, value])=>{
                            const label = document.createElement('label')
                            const input = document.createElement('input')
                            label.innerHTML = `${key}: ${value}`
                            input.value = `${value}`
                            fieldMethod.append(label)
                            fieldMethod.append(input)
                        })
                        
                    }
                })
                
            }
        })
        // return console.log( ok)
    }
  }