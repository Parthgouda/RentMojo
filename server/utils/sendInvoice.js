const nodemailer =
  require("nodemailer");

const PDFDocument =
  require("pdfkit");

const fs =
  require("fs");

const path =
  require("path");

const sendInvoice =
  async (order) => {

    try {

      /* =========================
         CREATE INVOICE FOLDER
      ========================= */

      const invoicesDir =
        path.join(
          __dirname,
          "../invoices"
        );

      if (
        !fs.existsSync(
          invoicesDir
        )
      ) {

        fs.mkdirSync(
          invoicesDir,
          {
            recursive: true,
          }
        );

      }

      /* =========================
         INVOICE PATH
      ========================= */

      const invoicePath =
        path.join(

          invoicesDir,

          `invoice-${order._id}.pdf`

        );

      /* =========================
         CREATE PDF
      ========================= */

      const doc =
        new PDFDocument({

          margin: 40,

        });

      const stream =
        fs.createWriteStream(
          invoicePath
        );

      doc.pipe(stream);

      /* =========================
         HEADER
      ========================= */

      doc
        .fontSize(26)
        .fillColor("#16a34a")
        .text(
          "RentMojo Invoice",
          {
            align:
              "center",
          }
        );

      doc.moveDown(2);

      /* =========================
         CUSTOMER DETAILS
      ========================= */

      doc
        .fontSize(14)
        .fillColor("black");

      doc.text(
        `Customer Name: ${order.customerName}`
      );

      doc.moveDown(0.5);

      doc.text(
        `Email: ${order.email}`
      );

      doc.moveDown(0.5);

      doc.text(
        `Phone: ${order.phone}`
      );

      doc.moveDown(0.5);

      doc.text(
        `Address: ${order.address}`
      );

      doc.moveDown(2);

      /* =========================
         PRODUCTS
      ========================= */

      doc
        .fontSize(18)
        .fillColor("#16a34a")
        .text(
          "Products"
        );

      doc.moveDown();

      order.products.forEach(
        (item, index) => {

          const qty =
            item.quantity || 1;

          const total =
            qty * item.price;

          doc
            .fontSize(13)
            .fillColor("black")
            .text(

              `${index + 1}. ${item.name}`

            );

          doc.text(
            `Category: ${item.category}`
          );

          doc.text(
            `Quantity: ${qty}`
          );

          doc.text(
            `Price: ₹${item.price}`
          );

          doc.text(
            `Total: ₹${total}`
          );

          doc.moveDown();

        }
      );

      /* =========================
         TOTAL PRICE
      ========================= */

      doc.moveDown();

      doc
        .fontSize(18)
        .fillColor("#16a34a")
        .text(
          `Grand Total: ₹${order.totalPrice}`,
          {
            align:
              "right",
          }
        );

      doc.moveDown(2);

      /* =========================
         FOOTER
      ========================= */

      doc
        .fontSize(12)
        .fillColor("gray")
        .text(
          "Thank you for shopping with RentMojo ❤️",
          {
            align:
              "center",
          }
        );

      doc.end();

      /* =========================
         WAIT FOR PDF SAVE
      ========================= */

      await new Promise(
        (
          resolve,
          reject
        ) => {

          stream.on(
            "finish",
            resolve
          );

          stream.on(
            "error",
            reject
          );

        }
      );

      /* =========================
         EMAIL TRANSPORT
      ========================= */

      const transporter =
        nodemailer.createTransport({

          service: "gmail",

          auth: {

            user:
              process.env.EMAIL_USER,

            pass:
              process.env.EMAIL_PASS,

          },

        });

      /* =========================
         SEND EMAIL
      ========================= */

      await transporter.sendMail({

        from:
          process.env.EMAIL_USER,

        to:
          order.email,

        subject:
          "RentMojo Order Invoice",

        html: `

          <div style="
            font-family:Arial;
            padding:20px;
          ">

            <h2 style="
              color:#16a34a;
            ">
              Order Confirmed ✅
            </h2>

            <p>
              Hello
              <b>
                ${order.customerName}
              </b>,
            </p>

            <p>
              Your order has been placed successfully.
            </p>

            <p>
              Total Amount:
              <b>
                ₹${order.totalPrice}
              </b>
            </p>

            <p>
              Invoice PDF is attached with this email.
            </p>

            <br/>

            <p>
              Thank you for shopping with RentMojo ❤️
            </p>

          </div>

        `,

        attachments: [

          {

            filename:
              `invoice-${order._id}.pdf`,

            path:
              invoicePath,

          },

        ],

      });

      console.log(
        "Invoice Sent Successfully ✅"
      );

      return true;

    } catch (error) {

      console.log(
        "Invoice Error =>",
        error.message
      );

      return false;

    }

  };

module.exports =
  sendInvoice;