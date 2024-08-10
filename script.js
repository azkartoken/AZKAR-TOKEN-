class Transaction {
    // نفس الكود السابق هنا
}

class Block {
    // نفس الكود السابق هنا
}

class Blockchain {
    // نفس الكود السابق هنا
}

const ec = new elliptic.ec('secp256k1');
const blockchain = new Blockchain();

async function register() {
    const email = document.getElementById("newEmail").value;
    const username = document.getElementById("newUsername").value;
    const password = document.getElementById("newPassword").value;

    if (!email || !username || !password) {
        document.getElementById("status").className = "error";
        document.getElementById("status").innerText = `Please provide email, username, and password.`;
        return;
    }

    const key = ec.genKeyPair();
    const privateKey = key.getPrivate('hex');
    const publicKey = key.getPublic('hex');

    const encryptedPrivateKey = CryptoJS.AES.encrypt(privateKey, password).toString();
    localStorage.setItem("privateKey", encryptedPrivateKey);
    localStorage.setItem("publicKey", publicKey);

    const passwordHash = CryptoJS.SHA256(password).toString();
    blockchain.registerUser(username, passwordHash);

    document.getElementById("status").className = "success";
    document.getElementById("status").innerText = `Registration successful. Your public key is ${publicKey}`;

    switchPage("page2");
}

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        document.getElementById("status").className = "error";
        document.getElementById("status").innerText = `Please provide email and password.`;
        return;
    }

    const passwordHash = CryptoJS.SHA256(password).toString();
    if (!blockchain.validateUser(email, passwordHash)) {
        document.getElementById("status").className = "error";
        document.getElementById("status").innerText = `Invalid email or password.`;
        return;
    }

    const encryptedPrivateKey = localStorage.getItem("privateKey");
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedPrivateKey, password);
    const privateKey = decryptedBytes.toString(CryptoJS.enc.Utf8);
    localStorage.setItem("privateKey", privateKey);

    document.getElementById("status").className = "success";
    document.getElementById("status").innerText = `Login successful.`;

    switchPage("page2");
}

function mineBlock() {
    const privateKey = localStorage.getItem("privateKey");
    if (!privateKey) {
        document.getElementById("minerStatus").className = "error";
        document.getElementById("minerStatus").innerText = `Please login first.`;
        return;
    }

    const key = ec.keyFromPrivate(privateKey, 'hex');
    const walletAddress = key.getPublic('hex');
    blockchain.minePendingTransactions(walletAddress);

    document.getElementById("minerStatus").className = "success";
    document.getElementById("minerStatus").innerText = `Mining complete.`;
}

function switchPage(pageId) {
    document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");
}

function fetchCryptoPrices() {
    // نفس كود جلب الأسعار السابق هنا
}

// Load crypto prices on page load
fetchCryptoPrices();
setInterval(fetchCryptoPrices, 60000);