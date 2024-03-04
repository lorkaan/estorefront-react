import {useState, useEffect } from "react";


interface RequestData{
    url: string;
    method: string;
    data?: any;
}

export interface FetchResponse<T>{
    data: T | null;
    error: string | null;
    loading: boolean;
}

const cookie_key = {
    csrf_token: "csrftoken"
};

const regex = {
    attr_seperator: "=",
    cookie_seperator: ";"
};

function getCookies(name: string | null = null){
    let cookieArray = document.cookie.split(regex.cookie_seperator);
    let cur_cookie: string[];
    if(name != null && name.length > 0){
        for (let i = 0; i < cookieArray.length; i++) {
            cur_cookie = cookieArray[i].split(regex.attr_seperator);
            if (cur_cookie[0] == name) {
                return cur_cookie[1];
            }
        }
        return "";
    }else{
        // Get All Cookies
        // But for now just raise error
        throw new TypeError("Name must be a string with length greater than 0");
    }
}


export function useFetch<T>(request: RequestData, transformFunc?: (jsonObj: Record<any, any>) => T): FetchResponse<T>{
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    let crsf_token = getCookies(cookie_key.csrf_token);
    useEffect(() => {
        fetch(request.url, {
            method: request.method,
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers : {
                'Content-Type': 'application/json',
                'X-CSRFToken': crsf_token
            },
            body: JSON.stringify(request.data)

        })
        .then(function (response) {
            if (response) {
                if (!response.ok || response.status != 200) {
                    throw new Error("Issue with sending from " + response.url + "   Status:" + response.status);
                }
                return response.json(); // Assumes JSON Response
            } else {
                throw new Error("Did not get a response from " + request.url);
            }
        })
        .then((resp_json) =>{
            if(transformFunc){
                setData(transformFunc(resp_json));
            }else{
                setData(resp_json);
            }
            setLoading(false);
        })
        .catch((err) => {
            setError(err.message);
            setLoading(false);
        });
    }, []);
    return {data: data, error: error, loading: loading};
}