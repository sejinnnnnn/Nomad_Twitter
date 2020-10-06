import { dbService } from "fBase";
import React, { useState } from "react";

const Sweet = ({ sweetObj, isOwner }) => {

    const [editing, setEditing] = useState(false);
    const [newSweet, setNewSweet] = useState(sweetObj.text);

    const onDeleteClick = () => {
        const ok = window.confirm("Are you sure you want to delete this sweet?");
        // console.log(ok);
        if (ok) {
            dbService.doc(`sweets/${sweetObj.id}`).delete();
        }
    }

    const onChange = (event) => {
        const {target:{value},} = event;
        setNewSweet(value);
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        console.log(sweetObj, newSweet);
        await dbService.doc(`sweets/${sweetObj.id}`).update({
            text: newSweet,
        })
        setEditing(false);
    }

    const toggleEditing = () => setEditing((prev) => !prev);

    return (
        <div key={sweetObj.id}>
            {
                editing ? (
                    <>
                    <form onSubmit={onSubmit}>
                        <input type="text" onChange={onChange} placeholder="Edit your sweet" value={newSweet} required />
                        <input type="submit" value="Update Sweet" />
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                    </>
                ) : (
                    <>
                        <h4>{sweetObj.text}</h4>
                        {sweetObj.attachmentUrl && <img src={sweetObj.attachmentUrl} width="50px" height="50px" />}
                        {isOwner && (
                        <>
                            <button onClick={onDeleteClick}>Delete Sweet</button>
                            <button onClick={toggleEditing}>Edit Sweet</button>
                        </>)}
                    </>
            )}
        </div>
    );
}

export default Sweet;