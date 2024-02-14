let preveiwContainer = document.querySelector('.job-preview');
let previewBox = preveiwContainer.querySelectorAll('.preview');

document.querySelectorAll('.products-container .product').forEach(product =>{
    product.onclick = () =>{
        preveiwContainer.style.display='flex';
        let name= product.getAttribute('data-name');
        previewBox.forEach(preview =>{
            let target = preview.getAttribute('data-target');
            
            if(name == target){
                preview.classList.add('active');
            }
        });
    };
});
previewBox.forEach(close =>{
    close.querySelector('.fa-times').onclick = () =>{
        close.classList.remove('active')
        preveiwContainer.style.display = 'none';
    };
});
document.addEventListener('DOMContentLoaded', function () {
    const clickableDiv = document.querySelector('.icon');
    const myDiv = document.getElementById('myDiv');
  
    clickableDiv.addEventListener('click', function () {
      // Toggle the display property of the div
      if (myDiv.style.display === 'none' || myDiv.style.display === '') {
        myDiv.style.display = 'block';
      } else {
        myDiv.style.display = 'none';
      }
    });
  });
