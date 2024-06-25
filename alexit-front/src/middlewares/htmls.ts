export const salesReportHtml = (dateRange: any, sales: any[], totals: any) => {
    return (`
    <!doctype html>
    <html lang="en">

    <head>
    <meta charset="utf-8">
    <title>AlexIT</title>
    <base href="/">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
        * {
            margin: 0;
            padding: 0;
        }
        
        .sales-report {
            width: 794px;
            height: fit-content;
        }
        .myTable { 
            width:100%;
            background-color:#eee;
            border-collapse:collapse; 
        }
        .myTable th { 
            background-color:#000;
            color:white;
         }
        .myTable td, .myTable th { 
            padding:5px;
            border:1px solid #000;
         }
         .inline{
            display: flex;
            gap: 8px;
         }
         .title{
         }
         .heading{
            display: flex;
            justify-content: center;
         }
         .footer{
            margin-top: 1rem;
            margin-left: 65%;
            display: flex;
            flex-direction: column;
            gap: 8px;
         }
         .footer div{
            display: flex;
            gap: 10px;
            border-bottom: 2px solid black
         }
    </style>
    </head>
        <body class="flex-class">
            <div class="sales-report">
                <div class="title">
                    <div class="heading">
                        <h2>Izvestaj o prodaji artikala za period od ${dateRange.from} do ${dateRange.to}</h2>
                    </div>
                    <div class="inline"><strong>Preduzece: </strong><p>AlexIT</p></div>
                    <div class="inline"><strong>Sediste: </strong><p>Krajiska 14, Futog, 21410</p></div>
                    <div class="inline"><strong>PIB: </strong><p>0658891631</p></div>
                </div>
                <table class="myTable">
                    <thead>
                        <tr>
                            <th>Group</th>
                            <th>UOM</th>
                            <th>Article code</th>
                            <th>Article name</th>
                            <th>Quantity</th>
                            <th>Purchase price</th>
                            <th>Margin</th>
                            <th>Price per UOM</th>
                            <th>Purchase value</th>
                            <th>Tax base</th>
                            <th>Vat rate</th>
                            <th>VAT</th>
                            <th>Sale value</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sales.map((sale) => {
        return (`
                        <tr>
                            <td>${sale.group.name}</td>
                            <td>${sale.uom}</td>
                            <td>${sale.articleCode}</td>
                            <td>${sale.articleName}</td>
                            <td>${sale.quantity}</td>
                            <td>${sale.purchasePrice}</td>
                            <td>${sale.margin}%</td>
                            <td>${sale.pricePerUom}</td>
                            <td>${sale.purchaseValue}</td>
                            <td>${sale.taxBase}</td>
                            <td>${sale.vatRate}%</td>
                            <td>${sale.vat}</td>
                            <td>${sale.saleValue}</td>
                        </tr>
                        `)
    }).join("")}
                    </tbody>
                </table>
                <div class="footer">
                    <div>
                        <strong>Ukupna kolicina prodatih artikala: </strong><p>${totals.quantity}</p>
                    </div>
                    <div>
                        <strong>Ukupna poreska osnovica: </strong><p>${totals.taxBase}</p>
                    </div>
                    <div>
                        <strong>PDV: </strong><p>${totals.vatAmount}</p>
                    </div>
                    <div>
                        <strong>Ukupna zarada: </strong><p>${totals.saleValue}</p>
                    </div>
                </div>
            </div>
        </body>
    </html>
    `);
};

export const accountingMail = (orderItems: any[], order: any, orders: any[], cashier: string) => {
    const ordersByDate = orders.filter(o => new Date(o.creationTime).getDate() === new Date().getDate());
    const ordersByThis = orders.filter(o => new Date(o.creationTime).getDate() === new Date(order.creationTime).getDate())

    const digitIf = (val: any) => String(Math.abs(val)).charAt(0) == val;

    const serialNum = () => {
        const byDateSorted = ordersByDate.sort((a, b) => new Date(a.creationTime).getTime() - new Date(b.creationTime).getTime());
        const byDateMatch = byDateSorted.find(o => o.creationTime === order.creationTime);
        const thisSorted = ordersByThis.sort((a, b) => new Date(a.creationTime).getTime() - new Date(b.creationTime).getTime());
        const thisMatch = thisSorted.find(o => o.creationTime === order.creationTime);

        let serialNum = '';
        if (byDateMatch) {
            const num = byDateSorted.indexOf(byDateMatch) + 1
            if (digitIf(num)) {
                serialNum = String("0" + num);
            } else if (!digitIf(num)) {
                serialNum = String(num);
            }
        } else {
            const num = thisSorted.indexOf(thisMatch) + 1;
            if (digitIf(num)) {
                serialNum = String("0" + num);
            } else if (!digitIf(num)) {
                serialNum = String(num);
            }
        }
        return serialNum;
    };

    const accountingNumber = () => {
        let accountingNumber = '';
        if (new Date(order.creationTime).getDate() === new Date().getDate()) {
            const today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, "");
            const sub = `${(today.substring(0, 4) + today.substring(6, today.length))}/${serialNum()}`;
            accountingNumber = sub;
        } else if (new Date(order.creationTime).getDate() !== new Date().getDate()) {
            const thisOrderDate = new Date(order.creationTime).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, "");
            const sub = `${(thisOrderDate.substring(0, 4) + thisOrderDate.substring(6, thisOrderDate.length))}/${serialNum()}`;
            accountingNumber = sub;
        }
        return accountingNumber
    };

    return (`
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style type="text/css">
            html {
                font-size: 100%;
                box-sizing: border-box;
                width: 210mm;
                height: fit-content;
            }

            body {
                margin: 0px;
                padding: 1rem;
                padding-bottom: 100px;
                width: 210mm;
                height: fit-content;
                border: 4px solid rgb(41, 41, 167);
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            header {
                display: flex;
                justify-content: center;
            }

            img {
                width: 250px;
                height: 90px;
            }

            main,
            section,
            footer {
                width: 100%;
            }

            .acc-header {
                border: 4px solid rgb(37, 37, 37);
                width: 200mm;
                padding: 7px 1rem 7px 1rem;
                display: flex;
                justify-content: space-between;
                line-height: 0;
            }

            .basic-info {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
            }

            .styled-table {
                border-collapse: collapse;
                margin: 25px 0;
                font-size: 0.9em;
                font-family: sans-serif;
                width: 100%;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
            }

            .styled-table thead tr {
                background-color: #009879;
                color: #ffffff;
                text-align: left;
            }

            .styled-table th,
            .styled-table td {
                padding: 12px 15px;
            }

            .styled-table tbody tr {
                border-bottom: 1px solid #dddddd;
            }

            .styled-table tbody tr:nth-of-type(even) {
                background-color: #f3f3f3;
            }

            .styled-table tbody tr:last-of-type {
                border-bottom: 2px solid #009879;
            }

            .styled-table tbody tr.active-row {
                font-weight: bold;
                color: #009879;
            }

            .foot-container {
                border-top: 4px solid rgb(53, 53, 53);
            }

            .foot-container {
                line-height: 0;
                padding-left: 70%;
            }
        </style>
        <title>Document</title>
    </head>

    <body>
        <header>
            <div class="acc-header">
                <div class="row1"><h1>AlexIT<h1/></div>
                <div class="row2">
                    <h3>AlexIT D.O.O. za proizvodnju i trgovinu</h3>
                    <p>Adresa: Stateboliuvo 14, 21410 Futog, RS</p>
                    <p>Telefon/fax: (+381) 21 442 442</p>

                </div>
            </div>
        </header>
        <main>
            <section class="section-1">
                <div class="basic-info">
                    <div style="line-height: 0;">
                        <p>Kupac: ${order.user.username}</p>
                        <p>Adresa: ${order.shipping.street}, ${order.shipping.city}, ${order.shipping.country}</p>
                        <p>PIB: ${order.shipping.email}</p>
                        <p>MB: ${order.shipping.phone}</p>
                    </div>
                    <div style="display: flex; flex-direction: column;">
                        <strong>U Novom Sadu</strong>
                        <strong>${new Date().toISOString().slice(0, 10)}</strong>
                        <strong>Prodavac: ${cashier}<strong/>
                    </div>
                </div>
                <div style="display: flex; gap: 13rem;">
                    <h1>Profaktura br:</h1>
                    <h1>${accountingNumber()}</h1>
                </div>
            </section>
            <section class="section-2">
                <table class="styled-table">
                    <thead>
                        <tr>
                            <th>R.B.</th>
                            <th>Naziv proizvoda</th>
                            <th>JM</th>
                            <th>Kol.</th>
                            <th>Cena po JM</th>
                            <th>Poreska osnovica</th>
                            <th>Stopa PDV</th>
                            <th>Iznos PDV</th>
                            <th>Za naplatu</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${orderItems.map((item, index) => {
        return (`
                        <tr>
                            <td>${index}</td>
                            <td>${item.name}</td>
                            <td>${item.uom}</td>
                            <td>${item.quantity}</td>
                            <td>${item.priceByUom}</td>
                            <td>${item.taxBase}</td>
                            <td>${item.vatRate}</td>
                            <td>${item.vatAmount}</td>
                            <td>${item.totalPayment}</td>
                        </tr>
                        `)
    }).join("")}
                    </tbody>
                </table>
            </section>
            <footer>
                <div class="foot-container">
                    <p>Ukupna poreska osnovica: ${orderItems.reduce((prev, cur) => prev + cur.taxBase, 0)}</p>
                    <p>Obracunati PDV 20%: ${orderItems.reduce((prev, cur) => prev + cur.vatAmount, 0)}</p>
                    <p>${order.courier.name}(${order.weight}kg): ${order.shippingCost}<p/>
                    <strong>UKUPNO ZA UPLATU: ${orderItems.reduce((prev, cur) => prev + cur.totalPayment, 0) + order.shippingCost}</strong>
                </div>
            </footer>
        </main>
    </body>

    </html>
    `)
};

export const orderStatusMail = (orderStatusMessage: string, order: any) => {
    return (`
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style type="text/css">
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html {
            font-size: 100%;
        }

        main {
            width: 100%;
        }
        .alexit{
            border-style: solid;
            padding: 20px;
            margin: 20px;
            text-align: center;
            font-size: 25px;
            border-width: 10px;
        }
    </style>
    <title>Document</title>
</head>

<body>
    <main>
        <div>
            <p>Broj narudžbe ${order.number}</p>
            <p>Datum naručivanja: ${new Date(order.creationTime).toLocaleDateString()}</p>
            <br>
            <p>Vaša narudžba je ažurirana i njen status je:</p>
            <p>${order.status}</p>
            <br><br>
            ${!!orderStatusMessage ? `
            <div>
                Komentar narudžbe:
                <br><br>
                ${orderStatusMessage}
            </div>
            ` : ""}


            <br><br><br>
            Ukoliko imate bilo kakvih pitanja budite slobodni i odgovorite na ovaj email.
        </div>
    </main>
</body>

</html>
    `);
};

export const newsletterOfferMail = (title: string, link: string) => {

    return (`
    <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Vibrant Design</title>
<style>
    body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #F8F8F8;
        color: #333;
    }
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 50px 20px;
        text-align: center;
    }
    h1 {
        font-size: 3em;
        margin-bottom: 30px;
        color: #FF4081; /* Vibrant Pink */
    }
    .image-container {
        overflow: hidden;
        position: relative;
        max-width: 100%;
        margin-bottom: 50px;
    }
    .image-container img {
        width: 100%;
        height: auto;
    }
</style>
</head>
<body>

        <div class="container">
            <h1>${title}</h1>
            <div class="image-container">
                <img src="cid:image" loading="lazy" role="presentation" decoding="async" fetchpriority="high" alt="peaceandlove">
            </div>
            <a href="${link}">link here</a>
        </div>

</body>
</html>
    
    `)
}

export const offerPreview = () => {
    return (`
    <!doctype html>
    <html lang="en">
    <head>
    <meta charset="utf-8">
    <title>AlexIT</title>
    <base href="/">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <style type="text/css">
        * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        scroll-behavior: smooth;
        }
        html,
        body {
            display: flex;
            flex-direction: column;
            height: 100vh;
            min-width: 100%;
            max-width: 100%;
        }
        html,
        body {
            height: 100%;
        }
        body {
            margin: 0;
            font-family: Roboto, "Helvetica Neue", sans-serif;
        }
    </style>
    </head>
    <body class="mat-typography">
    </body>
    </html>
    `);
};