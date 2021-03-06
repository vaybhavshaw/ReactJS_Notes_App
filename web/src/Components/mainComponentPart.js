import React, { Component } from "react";

import Modal from "./Modal";
import { Card, CardButtons, Tag, TagField } from "./Card";


class MainComponent extends Component {
    constructor(props){
        /**
         * TODO: What I need to fix React component
         *
         * - show edit button correctly(if note.userId is same as current user or has user id in shareUserList then show edit): ~1hour
         *
         * // additional with Lakshya
         * - edit note Route with parameter sending
         * - (add edit note api)
         */
        super(props);
        // TODO: check props, never push without comment out below.
        // console.log(props);

        var deleteFlg = props.currentUserId.indexOf(props.userId) !== -1;
        this.footer = (<footer className="card-footer">
            <Modal title={this.props.title}
                   allProps={this.props}
                   buttonLabel="View Note"
                   content={this.props.content}
                   deleteFlg={deleteFlg}
                   userId={this.props.userId}
                   noteId={this.props._id}
                   currentUserId={this.props.currentUserId}/>
        </footer>);
    }

    render(){
        return (
            <Card cardTitle={this.props.title} cardFooter={this.footer} cardType={this.props.type.toLowerCase()}>
                {this.props.description}
                <CardButtons likeCount={this.props.like.length} dislikeCount={this.props.dislike.length}
                             userId={this.props.userId} noteId={this.props._id}/>
                <TagField>
                    {this.props.tagNameList.map((tagData, key) => <Tag tagName={tagData} key={key.toString()}/>)}
                </TagField>
            </Card>
        );

    }
}
export default MainComponent;