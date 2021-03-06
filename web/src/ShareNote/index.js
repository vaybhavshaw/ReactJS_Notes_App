/**
 * Created by reiven on 2017/11/04.
 */
import React, { Component } from 'react';
import MainComponent from "../Components/mainComponentPart";
import {getAuthorizationHeader} from "../functions";

class ShareNote extends Component {
    constructor(props){
        super(props);
        let dataList = [];

        this.state = {"dataList": dataList, "currentUserId": ""};
    }

    componentDidMount(){
        let request = new Request('/api/db/share-note', {
            method: 'POST',
            headers: {
                "Authorization": getAuthorizationHeader().Authorization,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.props.profile)
        });

        // TODO: write re-rendering with setState and binding.
        fetch(request)
        .then(response => {
           if(!response.ok) {
               console.log("Error: could not conect server, in AllNote/index.js");
               return false;
           }
           return response.json();
        }).then(res => {
            console.log("this is allnote result",res);// This is Note data! parse here.
            // TODO: Tag data fix!
            if(res){
                this.setState({"dataList": res.content, "currentUserId": res.currentUserId});
            }
        });
    }

    render(){
        return (
            <div>
                <div>
                    <p className="centre-this title" style={{"padding-bottom":"1rem"}}>Notes shared with Me</p>
                </div>

                <div className="columns is-multiline">
                    {this.state.dataList.map((data, index) => <MainComponent {...data} currentUserId={this.state.currentUserId} key={index} />)}
                </div>
            </div>
        );
    }
}



export default ShareNote;