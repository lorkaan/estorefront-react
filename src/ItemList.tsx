import { FetchResponse, useFetch } from "./utils/fetch";
import { Item } from "./utils/types";


export default function ItemList() {
    const response: FetchResponse<Item[]> = useFetch<Item[]>({
        url: "/api/items/",
        method: "POST"
    }, (jsonObj) =>{
        return jsonObj.data;
    });

    if(response.loading){
        return (
            <div>
                <p>
                    Data is Loading...
                </p>
            </div>
        );
    }else if(response.error != null){
        return (
            <div>
                <p>{response.error}</p>
            </div>
        );
    }else if(response.data != null){
        return (
            <div>
                {response.data.map((item)=>(
                    <a href={"item/" + item.id}>
                        <div>
                            <h2>{item.name}</h2>
                            <p>{item.price}</p>
                        </div>
                    </a>
                ))}
            </div>
        );
    }else{
        return(
            <div>
                <p>No Data Found</p>
            </div>
        )
    }
    
}
