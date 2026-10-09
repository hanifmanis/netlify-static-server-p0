var products = [
    { name: "Produk A", category: "Elektronik", stock: 50, price: 1000000, location: "Gudang A", code: "PRD001", supplier: "supplier@example.com" },
    { name: "Produk B", category: "Elektronik", stock: 30, price: 500000, location: "Gudang B", code: "PRD002", supplier: "supplier2@example.com" },
    { name: "Produk C", category: "Elektronik", stock: 20, price: 1500000, location: "Gudang C", code: "PRD003", supplier: "supplier3@example.com" },
    { name: "Produk D", category: "Elektronik", stock: 40, price: 2000000, location: "Gudang D", code: "PRD004", supplier: "supplier4@example.com" },
];

function renderProducts() {
   // Answer here
   var container = document.querySelector('.product-cards'); 
   container.innerHTML = '';

   products.forEach(function(product,index){

    var card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
    <h3>${product.name}</h3>
    <p>Kategori : ${product.category}</p>
    <p>Stok : ${product.stock}</p>
    <p>Harga : ${product.price}</p>
    <p>Lokasi : ${product.location}</p>
    <p>Kode : ${product.code}</p>
    <p>Suplier : ${product.supplier}</p>
    <button class='button' onclick="fillForm(${index})">Perbarui</button>
    <button class='button-danger' onclick="deleteProduct(${index})">Hapus</button>
    `;

    container.appendChild(card);
   });

}

function fillForm(index) {
   // Answer here
    var product = products[index];
    document.getElementById('name').value = product.name;
    document.getElementById('category').value = product.category;
    document.getElementById('stock').value = product.stock;
    document.getElementById('price').value = product.price;
    document.getElementById('location').value = product.location;
    document.getElementById('code').value = product.code;
    document.getElementById('supplier').value = product.supplier;
    document.getElementById('index').value = index;
}

function updateProduct() {
    // Answer here
    var index = document.getElementById('index').value;

    products[index] = {
        name : document.getElementById('name').value,
        category : document.getElementById('category').value,
        stock : document.getElementById('stock').value,
        price : document.getElementById('price').value,
        location : document.getElementById('location').value,
        code : document.getElementById('code').value,
        supplier : document.getElementById('supplier').value,
    };

    renderProducts();
    clearForm();

}

function deleteProduct(index) {
    // Answer here
    var current_edit_string = document.getElementById('index').value;
    var current_edit = parseInt(current_edit_string)

    if (current_edit === index){
        alert("Produk sedang diedit. Selesaikan dulu editnya sebelum hapus");
        return;
    }

    if (products.length === 1) {
        alert("Produk tidak dapat dihapus karena hanya tersisa satu produk");
        return; 
    }

    products.splice(index,1);
    renderProducts();
    clearForm();
}

function clearForm() {
    document.getElementById('product-form').reset();
    document.getElementById('index').value = '';
}

function moveCarousel(direction) {
    var container = document.getElementsByClassName('product-cards')[0];
    var scrollAmount = 300;
    container.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

window.onload = function() {
    renderProducts();
    var hiddenIndexInput = document.createElement('input');
    hiddenIndexInput.type = 'hidden';
    hiddenIndexInput.id = 'index';
    document.getElementById('product-form').appendChild(hiddenIndexInput);
};
