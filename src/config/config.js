const config = {
    rootLink: "http://localhost:57238",
    //rootLink: "https://test-discount.orichi.info",
    version: 1,
    shop: OTGetUrlParameter("shop"),
    token: OTGetUrlParameter("token"),
    //shop: 'orichi-demo.myshopify.com',
    admin: OTGetUrlParameter("admin"),
    hmac: window.location.href.split("&hmac=")[1],
    apiKey: 'e890d056710ff0487220ef84de4f4bd7'
  };
  function OTGetUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split("&"),
      sParameterName,
      i;
    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split("=");
      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined
          ? true
          : decodeURIComponent(sParameterName[1]);
      }
    }
  }
  export default config; 
  