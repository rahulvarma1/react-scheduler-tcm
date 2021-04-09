
import React, { useState, useEffect } from 'react';

import '../Toast.css';

const Toast = props => {
    const { toastList, position } = props;
    const [list, setList] = useState(toastList);

    useEffect(() => {
        const interval = setInterval(() => {
            if (toastList.length && list.length) {
                deleteToast(toastList[0].id);
            }
        }, 4000);

        return () => {
            clearInterval(interval);
        }
    }, []);

    const deleteToast = id => {
        const index = list.findIndex(e => e.id === id);
        list.splice(index, 1);
        setList([...list]);
    }

    useEffect(() => {
        setList(toastList);
    }, [toastList, list]);



    return (
        <>
        {list.length > 0 ?
            <div className={`notification-container ${position}`}>
                {
                    list.map((toast, i) =>
                        <div
                            key={i}
                            className={`notification toast ${position} ${toast.backgroundColor}`}
                        >
                            <button onClick={() => deleteToast(toast.id)}>
                                X
                            </button>
                            <div className="notification-image">
                                <img src={toast.icon} alt="" />
                            </div>
                            <div>
                                <p className="notification-title">{toast.title}</p>
                                <p className="notification-message">
                                    {toast.description}
                                </p>
                            </div>
                        </div>
                    )
                }
            </div>
            :''
            }
        </>
    );
}



export default Toast;
