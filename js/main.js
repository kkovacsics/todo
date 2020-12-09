'use strict';

const now = new Date();
const date = document.querySelector('.todo__date')
date.innerHTML = `${now.toLocaleDateString('en-US', {weekday: 'long'})}
                    <br>
                    ${now.toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'}).replace(/\//g,'-')}`;