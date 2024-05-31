import { useEffect, useState } from "react";
import { GMultiple } from "../../Core/components/GMultiple"
import styles from "../styles/crear_encuesta.module.css";
import { validate_form } from '../../Core/scripts/form';
import {GForm} from '../../Core/components/GForm.js';
import { communication } from "../../Core/scripts/communication";
import { GCard } from "../../Core/components/GCard";
import { cookie_in_cookies_string } from "../../Core/scripts/cookie";
import { complex } from "suneditor-react/dist/buttons/buttonList";

/**
 * Esta funcion sirve para recibir parametros del server se ejecuta con SSR de nextjs, pero no es la funcion pura la funcion completa esta en CustomServices
 * @param {} params 
 * @returns 
 */

export async function server_props(context){
    try{
        /**Se define el dominio base para las consultas */
        /**
         * Aqui se crean las variables modulo y entity que toman como valor los campos variables de la url, por ejemplo https://example.com/var1/var2/accion
         */
        let session_token = cookie_in_cookies_string({name:'session_token',cookies_string: context.req.headers.cookie});
        /**Se hace la consulta fetch a otro servidor externo o al local segun como se identifique en api_domain */
        //const res_api = await fetch(`${api_domain}/api/Survey/SURSurvey/scheme?action=insert`,{method: "POST"});
        console.log("-ooooooo token", session_token);
        const data = await communication({url:`/api/Survey/SURSurvey/scheme?action=insert`,session_token});
        /**Se genera una excepcion si no se ejecuta correctamente la api */
        console.log("-nnnnnnnn data", data);
        data.fields = data.fields.map(e=>{
            if(e.id=='descripcion') return {...e, className:`${styles.descripcion} gform-line`};
            return e;
        });
        console.log(data);
        return {scheme: data}
    }catch(error){
        console.log(error);
        return { props: { } }
    }
}
export default({server_props})=>{
    console.log("-------server-props-end", server_props);
    console.log("******scheme", server_props.scheme)
    if(!server_props?.scheme) return(<Error txt={`La ruta principal no existe`}/>);
    let values = useState({});
    let id_encuesta = useState();
    let scheme = server_props.scheme;
    
    
    async function onSubmit_1(){
        try{
            console.log(values[0]);
            await validate_form(values[0], scheme.fields);
            let url = '/api/Survey/SURSurvey/insert';
            let respuesta_json = await communication({url, data: values[0]});
            values[1]({});
            alert(respuesta_json.message);
            id_encuesta[1](respuesta_json.id);
        }catch(error){
            console.log("-------errores",error);
            alert(error);
        }
    }
    
    return (
        <>
        {scheme ? 
            <GCard title={scheme.title}>
                <GForm
                    scheme={scheme} 
                    values={values} 
                    primary_action={'insert'} 
                    action={'insert'}
                    onSubmit={onSubmit_1}
                    />
            </GCard>
            : <div>Cargando Formulario ...</div>
        
        }
        </>
    );
}