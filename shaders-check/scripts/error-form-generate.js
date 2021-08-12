
export const errorInfo = (err) => {
    const form = document.getElementById('form__info_shaders')
    const contractId = document.getElementById('contractId__contract')
    const fieldID = document.getElementById('error')
    const field = document.createElement('fieldset')
    const legend = document.createElement('legend')
    const codeContractName = document.createElement('span')
    const codeContract = document.createElement('span')
    const dataContractName = document.createElement('span')
    const dataContract = document.createElement('span')
    const msgContractName = document.createElement('span')
    const msgContract = document.createElement('span')  
    if(err === undefined ) {
        if(form.lastElementChild.classList.contains('error')){
           form.removeChild(fieldID)
        }
        return
    } 
    field.classList.add('fieldset_shader', 'error')
    field.id = 'error'
    codeContractName.innerHTML = "CODE: "
    codeContract.innerHTML= ` ${err.code}`
    dataContractName.innerHTML = "DATA: "
    dataContract.innerHTML= ` ${err.data}`
    dataContractName.innerHTML = "DATA: "
    dataContract.innerHTML= ` ${err.data}`
    msgContractName.innerHTML = "MSG: "
    msgContract.innerHTML= ` ${err.message}`
    legend.innerHTML= `ErrorInfo`
    contractId.innerHTML = `${err}`
    
    if(!form.lastElementChild.classList.contains('error')){
    form.append(field)
    field.append(legend)
    field.append(codeContractName)
    codeContractName.append(codeContract)
    field.append(dataContractName)
    dataContractName.append(dataContract)
    field.append(msgContractName)
    msgContractName.append(msgContract)
    return}
    else {
        codeContractName.innerHTML = "CODE: "
        codeContract.innerHTML= ` ${err.code}`
        dataContractName.innerHTML = "DATA: "
        dataContract.innerHTML= ` ${err.data}`
        dataContractName.innerHTML = "DATA: "
        dataContract.innerHTML= ` ${err.data}`
        msgContractName.innerHTML = "MSG: "
        msgContract.innerHTML= ` ${err.message}`
    return
    }
}
