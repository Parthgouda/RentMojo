const sendEmail = require("./sendEmail");


const PDFDocument =
  require("pdfkit");

const fs =
  require("fs");

const path =
  require("path");

const QRCode =
  require("qrcode");

/* =========================
   ASSETS
========================= */

const logoPath = path.join(
  __dirname,
  "../../assets/logo.png"
);

const signaturePath = path.join(
  __dirname,
  "../../assets/signature.png"
);

const stampPath = path.join(
  __dirname,
  "../../assets/stamp.png"
);



/* =========================
   SEND INVOICE
========================= */

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
         FILE PATHS
      ========================= */

      const invoicePath =
        path.join(
          invoicesDir,
          `invoice-${order._id}.pdf`
        );

      const qrPath =
        path.join(
          invoicesDir,
          `qr-${order._id}.png`
        );

      /* =========================
         GENERATE QR CODE
      ========================= */

      await QRCode.toFile(

        qrPath,

        `
Invoice ID: ${order._id}

Customer:
${order.customerName}

Amount:
₹${order.totalPrice}

Delivery Date:
${new Date(
  order.deliveryDate
).toLocaleDateString()}

Status:
${order.status}
`

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
   PREMIUM HEADER
========================= */

doc
  .rect(
    0,
    0,
    700,
    90
  )
  .fill("#16a34a");

if (
  fs.existsSync(
    logoPath
  )
) {

  doc.image(
    logoPath,
    40,
    10,
    {
      width: 60,
    }
  );

}

doc
  .fillColor("white")
  .fontSize(30)
  .text(
    "RentMojo",
    120,
    25
  );

doc
  .fontSize(14)
  .text(
    "Rental Invoice",
    120,
    60
  );

doc.moveDown(4);

/* =========================
   INVOICE DETAILS
========================= */

doc
  .fillColor("black")
  .fontSize(12);

doc.text(
  `Invoice ID: ${order._id}`
);

doc.text(
  `Order Date: ${new Date(
    order.createdAt
  ).toLocaleDateString()}`
);

doc.text(
  `Delivery Date: ${new Date(
    order.deliveryDate
  ).toLocaleDateString()}`
);

doc.text(
  `Order Status: ${order.status}`
);

doc.text(
  `Payment Method: ${order.paymentMethod}`
);

doc.text(
  `Payment Status: ${order.paymentStatus}`
);

doc.moveDown(2);

/* =========================
   CUSTOMER DETAILS
========================= */

doc
  .fontSize(18)
  .fillColor("#16a34a")
  .text(
    "Customer Details"
  );

doc.moveDown();

doc
  .fontSize(13)
  .fillColor("black");

doc.text(
  `Customer Name: ${order.customerName}`
);

doc.text(
  `Email: ${order.email}`
);

doc.text(
  `Phone: ${order.phone}`
);

doc.text(
  `Address: ${order.address}`
);

doc.moveDown(2);
/* =========================
   PRODUCTS SECTION
========================= */

doc
  .fontSize(18)
  .fillColor("#16a34a")
  .text(
    "Products Ordered"
  );

doc.moveDown();

doc
  .fontSize(12)
  .fillColor("black");

doc.text(
  "------------------------------------------------------------"
);

order.products.forEach(
  (item, index) => {

    const qty =
      item.quantity || 1;

    const total =
      qty * item.price;

    doc.text(
      `${index + 1}. ${item.name}`
    );

    doc.text(
      `Category : ${item.category}`
    );

    doc.text(
      `Quantity : ${qty}`
    );

    doc.text(
      `Price    : ₹${item.price}`
    );

    doc.text(
      `Total    : ₹${total}`
    );

    doc.text(
      "------------------------------------------------------------"
    );

    doc.moveDown(0.5);

  }
);

/* =========================
   GRAND TOTAL BOX
========================= */

doc.moveDown(2);

const currentY =
  doc.y;

doc
  .roundedRect(
    320,
    currentY,
    220,
    60,
    10
  )
  .fill("#16a34a");

doc
  .fillColor("white")
  .fontSize(16)
  .text(
    "Grand Total",
    370,
    currentY + 10
  );

doc
  .fontSize(22)
  .text(
    `₹${order.totalPrice}`,
    390,
    currentY + 30
  );

doc.moveDown(5);

/* =========================
   QR CODE SECTION
========================= */

doc
  .fillColor("black")
  .fontSize(14)
  .text(
    "Scan To Verify Invoice"
  );

doc.moveDown();

doc.image(
  qrPath,
  50,
  doc.y,
  {
    width: 110,
  }
);

doc
  .fillColor("#16a34a")
  .fontSize(12)
  .text(
    "Verified Digital Invoice",
    180,
    doc.y - 80
  );

doc.moveDown(8);
/* =========================
   SIGNATURE SECTION
========================= */

doc.moveDown(2);

doc
  .fillColor("black")
  .fontSize(13);

doc.text(
  "Customer Signature"
);

doc.text(
  "________________________"
);

doc.moveDown(2);

doc.text(
  "Authorized Signature"
);

if (
  fs.existsSync(
    signaturePath
  )
) {

  doc.image(
    signaturePath,
    350,
    doc.y - 25,
    {
      width: 120,
    }
  );

}

doc.moveDown(2);

doc
  .fillColor("#16a34a")
  .fontSize(14)
  .text(
    "Digitally Signed",
    350
  );

doc.text(
  "Parth Gouda",
  350
);

doc.text(
  "Authorized Signatory",
  350
);

/* =========================
   COMPANY STAMP
========================= */

/* =========================
   COMPANY STAMP
========================= */

if (
  fs.existsSync(
    stampPath
  )
) {

  doc.image(
    stampPath,
    430,
    doc.y - 80,
    {
      width: 90,
    }
  );

  doc
    .fillColor("red")
    .fontSize(10)
    .text(
      "Official Company Seal",
      420,
      doc.y + 10
    );

}

doc.moveDown(3);

/* =========================
   FOOTER
========================= */

doc
  .fontSize(13)
  .fillColor("#16a34a");

doc.text(
  "RentMojo Pvt. Ltd.",
  {
    align: "center",
  }
);

doc.text(
  "Thank You For Choosing RentMojo ❤️",
  {
    align: "center",
  }
);

doc.text(
  "support@rentmojo.com",
  {
    align: "center",
  }
);

doc.text(
  "+91 9876543210",
  {
    align: "center",
  }
);

doc.text(
  "www.rentmojo.com",
  {
    align: "center",
  }
);

doc.text(
  "This is a computer generated invoice and does not require a physical signature.",
  {
    align: "center",
  }
);

/* =========================
   END PDF
========================= */

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
console.log("STEP 4: Sending Email via Brevo API");

const result = await sendEmail({
  to: order.email,
  subject: "RentMojo Rental Invoice",
  html: `
    <div style="font-family:Arial;padding:20px">
      <h2 style="color:#16a34a">Rental Booking Confirmed ✅</h2>

      <p>Hi <b>${order.customerName}</b>,</p>

      <p>Your booking is confirmed.</p>

      <p><b>Invoice ID:</b> ${order._id}</p>
      <p><b>Total:</b> ₹${order.totalPrice}</p>

      <p>Thanks for choosing RentMojo ❤️</p>
    </div>
  `,
  attachment: {
    filename: `invoice-${order._id}.pdf`,
    path: invoicePath,
  },
});
console.log("BREVO RESPONSE SENT ✔️", result);
console.log("EMAIL SENT SUCCESSFULLY ✅");

console.log(
  "Premium Invoice Sent Successfully ✅"
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