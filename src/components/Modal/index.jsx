import React from 'react'
import classes from './index.module.css'
import { useRef, useEffect, useState } from 'react'
const apiUrl = import.meta.env.VITE_API_URL;

const token = localStorage.getItem('auth_token');
const Modal = ({ closeModal, canvasId }) => {


    const modalRef = useRef();
    const [sharedWith, setSharedWith] = useState([]);
    const [formData, setFormData] = useState("");





    useEffect(() => {
        const fetchCanvasData = async () => {
            const token = localStorage.getItem('auth_token');
            try {
                const response = await fetch(`${apiUrl}/api/canvas/load/${canvasId}`, {
                    method: "GET",
                    headers: {
                          'ngrok-skip-browser-warning': 'any-value' ,
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Something went wrong");
                }

                console.log(data);
                // Set the shared users from the API response
                // Assuming the API returns shared users in data.sharedWith or similar property
                if (Array.isArray(data.sharedEmail)) {
                    setSharedWith(data.sharedEmail);
                } else {
                    setSharedWith([]);
                }

            } catch (error) {
                console.log("unable to fetch canvas", error.message);
                setSharedWith([]);
            }
        };
        if (canvasId) {
            fetchCanvasData();
        }
    }, [canvasId]);







    const handleBackdropClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            closeModal(true);
        }
    };

    const handleChange = (event) => {
        setFormData(event.target.value.trim());
    }

    const shareHandler = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/canvas/share/${canvasId}`, {
                method: "PATCH",
                headers: {
                      'ngrok-skip-browser-warning': 'any-value' ,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: formData })

            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }
            setSharedWith((prev) => {
                const updated = [...prev, formData];

                return updated;
            });


            setFormData("");
            alert("shared succesfully");
            console.log("shared successfully:", data);


        } catch (err) {
            alert(err.message);
            console.error("Error:", err.message);
        }
    }

    return (
        <div className={classes.backdrop} onClick={handleBackdropClick}>
            <div ref={modalRef} className={classes.container}>
                <input type="email" onChange={handleChange} value={formData} placeholder='email of person to share with ' />
                <button onClick={shareHandler}> share </button>
                <h2>Already shared Persons </h2>
                <ul>
                    {
                        sharedWith.map((email, index) => (


                            <li key={index}> {email}

                                <button>Revoke Access</button>
                            </li>

                        ))
                    }
                </ul>
            </div>

        </div>
    )
}

export default Modal;