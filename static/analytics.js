window.dataLayer = window.dataLayer || [];
window.gtag = function gtag() {
	window.dataLayer.push(arguments);
};

window.gtag('js', new Date());
window.gtag('config', 'G-418QESNPEX');

const analyticsLoader = document.createElement('script');
analyticsLoader.async = true;
analyticsLoader.src = 'https://www.googletagmanager.com/gtag/js?id=G-418QESNPEX';
document.head.append(analyticsLoader);
