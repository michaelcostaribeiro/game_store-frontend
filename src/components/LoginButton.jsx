import { createPortal } from "react-dom"

// Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";
import Login from "./Login";


const LoginButton = ({ storeTitle }) => {
    const [showModal, setShowModal] = useState(false);
    
    function showModalHideScroll () {
        document.body.style.overflow = 'hidden';
        setShowModal(true)
    }
    function hideModalShowScroll () {
        document.body.style.overflow = 'unset';
        setShowModal(false)
    }
    return (
        <>
            <button className="cursor-pointer" onClick={showModalHideScroll}><FontAwesomeIcon icon={faUser} /></button>
            {showModal && createPortal(
                <Login onClose={hideModalShowScroll} />,
                document.body
            )}
        </>
    )
}

export default LoginButton