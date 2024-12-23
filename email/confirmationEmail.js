import { CLIENT_URL } from "../config.js";

export const confirmationEmail = (link) => {
    return `
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta name="format-detection" content="telephone=no" />
        <title>Account Confirmation</title>
        <link
            href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap"
            rel="stylesheet"
        />
        <style>
            a {
                color: inherit !important;
                text-decoration: none !important;
            }
            @media only screen and (max-width: 600px) {
                h2 {
                    font-size: 32px !important;
                }
                p,
                a {
                    font-size: 14px !important;
                    line-height: 150% !important;
                }
                .logo {
                    width: 90px !important;
                    height: auto !important;
                }
            }
        </style>
    </head>
    <body
        style="
            font-family: Geist, sans-serif;
            padding: 30px;
            margin: 0 auto;
            max-width: 100%;
            height: 100%;
            background-color: #000000;
        "
    >
        <div class="content-table" style="width: 100%; margin: 10 auto; max-width: 500px">
            <img
                width="100"
                height="100"
                src="https://fpggnzi.stripocdn.email/content/guids/CABINET_679ae1ef16cd3ecfccbcc3d9e689fafe6acb6356c2049802942dc91c481d1005/images/zeglelogowithborder.png"
                style="display: block"
                class="logo"
                alt="Zegle Logo"
                href=${CLIENT_URL}
            />

            <h2 style="margin: 20px 0; font-size: 32px; color: #efefef">
                <strong>Confirm your account</strong>
            </h2>

            <h6
                style="
                    margin: 20px 0;
                    font-weight: 400;
                    font-size: 16px;
                    color: #cccccc;
                    width: 100%;
                "
            >
                Thank you for signing up for Zegle. To confirm your account,
                please follow the button below
            </h6>

            <div style="margin: 20px 0">
                <a
                    href=${link}
                    style="
                        color: inherit !important;
                        text-decoration: none !important;
                        display: inline-block;
                        padding: 10px 20px;
                        background: #efefef;
                        border-radius: 5px;
                        color: #333333;
                        font-size: 14px;
                    "
                >
                    Confirm your account
                </a>
            </div>

            <p
                style="
                    margin: 20px 0;
                    color: #999999;
                    font-size: 14px;
                    line-height: 1.5;
                "
            >
                Zegle is an advertisement-free platform inspired by Omegle. The
                platform embraces a better UI and seamless functionality. In
                case you encounter any bugs or errors, please connect with us at
                support@zegle.in or submit feedback here.
            </p>
        </div>
    </body>
    </html>
`;
};