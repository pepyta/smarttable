export default function generateEmail(title: string, description: string, url: string, buttonText: string){
    return (`<!DOCTYPE html>
    <html lang="en">
    
    <body>
        <style>
            html {
                font-family: sans-serif;
            }
    
            .card {
                min-width: 502px;
                max-width: 100%;
                border-style: solid;
                border-width: thin;
                border-color: #dadce0;
                border-radius: 8px;
                max-width: 516px;
                min-width: 220px;
                margin: 0 auto;
                padding: 40px 20px;
            }
    
            .btn {
                border-radius: 8px;
                background-color: black;
                font-size: 14px;
                border: none;
                padding: 10px 24px;
                color: white;
            }
        </style>
        <table width="100%" height="100%" style="min-width:348px" border="0" cellspacing="0" cellpadding="0" lang="en">
            <tbody>
                <tr height="32" style="height:32px">
                    <td></td>
                </tr>
                <tr align="center">
                    <td>
                        <table border="0" cellspacing="0" cellpadding="0"
                            style="padding-bottom:20px;max-width:516px;min-width:220px">
                            <tbody>
                                <tr>
                                    <td>
                                        <div style="border-style:solid;border-width:thin;border-color:#dadce0;border-radius:8px;padding:40px 20px"
                                            align="center">
                                            <div
                                                style="font-family:Roboto,RobotoDraft,Helvetica,Arial,sans-serif;color:rgba(0,0,0,0.87);line-height:32px;padding-bottom:24px;text-align:center;word-break:break-word">
                                                <div style="font-size:24px">${title}</div>
    
                                            </div>
                                            <span>
                                                <div
                                                    style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:14px;color:rgba(0,0,0,0.87);line-height:20px;padding-top:20px;text-align:left">
                                                    ${description}<div style="padding-top:32px;text-align:center"><a
                                                            href="${url}"
                                                            style="font-family:Roboto,RobotoDraft,Helvetica,Arial,sans-serif;line-height:16px;color:#ffffff;font-weight:400;text-decoration:none;font-size:14px;display:inline-block;padding:10px 24px;background-color:black;border-radius:5px;min-width:90px"
                                                            target="_blank">
                                                            ${buttonText}
                                                        </a>
                                                    </div>
                                                </div>
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr height="32" style="height:32px">
                    <td></td>
                </tr>
            </tbody>
        </table>
    </body>
    
    </html>`);
}