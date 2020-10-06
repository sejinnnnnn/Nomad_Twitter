import React, { useState, useEffect } from 'react';
import { dbService, storageService } from "fBase";
import Sweet from "./Sweet";
import { storage } from 'firebase';
import { v4 as uuidv4 } from 'uuid';

const Home = ({ userObj }) => {

    // console.log(userObj);

    const [sweet, setSweet] = useState("");
    const [sweets, setSweets] = useState([]);
    const [attachment, setAttachment] = useState();

    // const getSweets = async() => {
    //     const dbSweets = dbService.collection("sweets").get();
    //     (await dbSweets).forEach((document) => {
    //         const sweetObject = {
    //             ...document.data(),
    //             id: document.id,
    //         };

    //         console.log(sweetObject);   

    //         setSweets((prev) => [sweetObject, ...prev]);
    //     });
    // };

    useEffect(() => {
        // getSweets();
        dbService.collection("sweets").onSnapshot(snapshot => {
            const sweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setSweets(sweetArray);
        });
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault(); 
        const fileRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
        const response = await fileRef.putString(attachment, "data_url");
        const attachmentUrl = await response.ref.getDownloadURL();
        const sweetObj = {
            text: sweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl
        }
        await dbService.collection("sweets").add(sweetObj)
        setSweet("");
        setAttachment(null);
    };

    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setSweet(value);
    };

    const onFileChange = (event) => {
        // console.log(event.target.files);
        const {
            target: { files },
        } = event;
        const theFile = files[0];
        
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const { 
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }

    const onClearAttachment = () => setAttachment(null);

    // console.log(sweets);

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={sweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type="submit" value="Sweet" />
                {attachment && 
                <div>
                    <img src={attachment} width="50px" height="50px" />
                    <button onClick={onClearAttachment}>Clear</button>
                </div>
                }
            </form>
            <div>
                {sweets.map((sweet) => 
                    <Sweet key={sweet.id} sweetObj={sweet} isOwner={sweet.creatorId === userObj.uid} />
                )}
            </div>
        </div>
    );

};

export default Home;