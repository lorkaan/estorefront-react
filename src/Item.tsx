import { useParams } from "react-router-dom";
import { FetchResponse, useFetch } from "./utils/fetch";
import { Item, ItemOption, ItemOptionContainer } from "./utils/types";
import { MouseEventHandler } from "react";
import { isElementAccessExpression } from "typescript";


function ItemSection(props: Item){
    return (
        <div>
            <p>Name: {props.name}</p>
            <p>Description: {props.description}</p>
            <p>Price: {props.price}</p>
        </div>
    );
}

function ItemOptionDisplayInput(props: ItemOption){

    function handleClick(event: React.MouseEvent){
        const disabled = event.currentTarget.getAttribute("disabled");
        if(disabled){
            event.preventDefault();
        }else{
            console.log(disabled);
        }
    }

    return (
        <input type="radio" checked={props.default} disabled={!props.available} onClick={handleClick}/>
    );
}

function ItemOptionLabel(props: ItemOption){
    return (
        <span>
            <ItemOptionDisplayInput {...props}/>
            <label>{props.option_name}</label>
        </span>
    );
}

function ItemOption(props: ItemOption){
    return (
        <div>
            <ItemOptionLabel {...props} />
            <button className="switch_edit">Edit</button>
        </div>
        
    );
}

function ItemOptionList(props: ItemOption[]){
    return (
        <div>
            {props.map((opt) => (
                <ItemOption {...opt} />
            ))}
        </div>
    );
}

export default function ItemDetails() {

    const { id } = useParams();

    const response: FetchResponse<ItemOptionContainer> = useFetch<ItemOptionContainer>({
        url: "/api/item/",
        method: "POST",
        data: {
            'id': Number(id) || 0
        }
    });

    console.log(response);

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
                <p>Response Error</p>
                <p>{response.error}</p>
            </div>
        );
    }else if(response.data != null){
        return (
            <div>
                <ItemSection name={response.data.item.name} description={response.data.item.description} price={response.data.item.price}/>
                <ItemOptionList {...response.data.options} />
            </div>
        );
    }else{
        return (<div>Error: Issue with the response</div>);
    }

}