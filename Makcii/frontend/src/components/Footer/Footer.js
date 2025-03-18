import React from 'react';
import "./Footer.css";


const Footer = () => {

    return(
        <footer className="footer">
            <div className={"footer-container"}>
                <div className={"column"}>
                    <h1>Макции</h1>

                </div>
                <div className={"column"}>
                    <h4><a href="/">ПОЧЕТНА</a></h4>
                    <h4><a href="/about">ЗА НАС</a></h4>
                    <h4><a href="/issuers">ИЗДАВАЧИ</a></h4>
                    <h4><a href="/profile">МОЈ ПРОФИЛ</a></h4>
                </div>
                <div className={"column"}>
                    <h3>Изработиле:</h3>
                    <div>Маријана Петровска</div>
                    <div>Илина Дураковска</div>
                    <div>Наталија Насева</div>
                </div>
            </div>

            <hr/>
            <p>© 2024 Макции. Сите права се задржани.</p>
        </footer>
    )
}

export default Footer;