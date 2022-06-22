const ShopifyMoney = {
    TranslateMoney: function (number, format) {
        var valueReturn = '';
        var indexOfStart = format.indexOf("{{");
        var indexOfEnd = format.indexOf("}}");
        var replaceValue = format.substring(indexOfStart, indexOfEnd + 2);
        var numberReturn = '';
        number = Math.round(parseFloat(number),2);
        switch (replaceValue) {
            case '{{amount}}':
                numberReturn = number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                break;
            case '{{amount_no_decimals}}':
                numberReturn = number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                break;
            case '{{amount_with_comma_separator}}':
                numberReturn = number.toFixed(2).replace(/\d(?=(\d{3})+\,)/g, '$&.');
                break;
            case '{{amount_no_decimals_with_comma_separator}}':
                numberReturn = number.toString().replace(/\B(?<!\,\d*)(?=(\d{3})+(?!\d))/g, ".")
                break;
            case '{{amount_with_apostrophe_separator}}':
                numberReturn = new Intl.NumberFormat('de-CH',
                    { style: 'currency', currency: 'CHF' }).format(number);
                numberReturn = numberReturn.replace('CHF ', '');
                break;
            default:
                numberReturn = number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                break;
        }
        valueReturn = format.replace(replaceValue, numberReturn);
        return valueReturn;
    },
    money_with_currency_format : {
        "USD": "${{amount}} USD",
        "EUR": "&euro;{{amount}} EUR",
        "GBP": "&pound;{{amount}} GBP",
        "CAD": "${{amount}} CAD",
        "ARS": "${{amount_with_comma_separator}} ARS",
        "AUD": "${{amount}} AUD",
        "BBD": "${{amount}} Bds",
        "BDT": "Tk {{amount}} BDT",
        "BSD": "BS${{amount}} BSD",
        "BHD": "{{amount}}0 BHD",
        "BRL": "R$ {{amount_with_comma_separator}} BRL",
        "BOB": "Bs{{amount_with_comma_separator}} BOB",
        "BND": "${{amount}} BND",
        "BGN": "{{amount}} лв BGN",
        "MMK": "K{{amount}} MMK",
        "KYD": "${{amount}} KYD",
        "CLP": "${{amount_no_decimals}} CLP",
        "CNY": "&#165;{{amount}} CNY",
        "COP": "${{amount_with_comma_separator}} COP",
        "CRC": "&#8353; {{amount_with_comma_separator}} CRC",
        "HRK": "{{amount_with_comma_separator}} kn HRK",
        "CZK": "{{amount_with_comma_separator}} K&#269;",
        "DKK": "kr.{{amount_with_comma_separator}}",
        "DOP": "RD$ {{amount_with_comma_separator}}",
        "XCD": "EC${{amount}}",
        "EGP": "LE {{amount}} EGP",
        "XPF": "{{amount_no_decimals_with_space_separator}}} XPF",
        "FJD": "FJ${{amount}}",
        "GHS": "GH&#8373;{{amount}}",
        "GTQ": "{{amount}} GTQ",
        "GYD": "${{amount}} GYD",
        "GEL": "{{amount}} GEL",
        "HKD": "HK${{amount}}",
        "HUF": "{{amount_no_decimals_with_comma_separator}} Ft",
        "ISK": "{{amount_no_decimals}} kr ISK",
        "INR": "Rs.{{amount}}",
        "IDR": "Rp {{amount_with_comma_separator}}",
        "NIS": "{{amount}} NIS",
        "JMD": "${{amount}} JMD",
        "JPY": "&#165;{{amount_no_decimals}} JPY",
        "JOD": "{{amount}}0 JOD",
        "KZT": "{{amount}} KZT",
        "KES": "KSh{{amount}}",
        "KWD": "{{amount}}0 KWD",
        "LVL": "Ls {{amount}} LVL",
        "LTL": "{{amount}} Lt",
        "MXN": "$ {{amount}} MXN",
        "MYR": "RM{{amount}} MYR",
        "MUR": "Rs {{amount}} MUR",
        "MDL": "{{amount}} MDL",
        "MAD": "Dh {{amount}} MAD",
        "MNT": "{{amount_no_decimals}} MNT",
        "MZN": "Mt {{amount}} MZN",
        "ANG": "{{amount}} NA&fnof;",
        "NZD": "${{amount}} NZD",
        "NGN": "&#8358;{{amount}} NGN",
        "NOK": "kr {{amount_with_comma_separator}} NOK",
        "OMR": "{{amount_with_comma_separator}} OMR",
        "PKR": "Rs.{{amount}} PKR",
        "PYG": "Gs. {{amount_no_decimals_with_comma_separator}} PYG",
        "PEN": "S/. {{amount}} PEN",
        "PHP": "&#8369;{{amount}} PHP",
        "PLN": "{{amount_with_comma_separator}} zl PLN",
        "QAR": "QAR {{amount_with_comma_separator}}",
        "RON": "{{amount_with_comma_separator}} lei RON",
        "RUB": "&#1088;&#1091;&#1073;{{amount_with_comma_separator}} RUB",
        "SAR": "{{amount}} SAR",
        "RSD": "{{amount}} RSD",
        "SCR": "Rs {{amount}} SCR",
        "SGD": "${{amount}} SGD",
        "SYP": "S&pound;{{amount}} SYP",
        "ZAR": "R {{amount}} ZAR",
        "KRW": "&#8361;{{amount_no_decimals}} KRW",
        "LKR": "Rs {{amount}} LKR",
        "SEK": "{{amount_no_decimals}} kr SEK",
        "CHF": "SFr. {{amount}} CHF",
        "TWD": "${{amount}} TWD",
        "THB": "{{amount}} &#xe3f; THB",
        "TZS": "{{amount}} TZS",
        "TTD": "${{amount}} TTD",
        "TRY": "{{amount}}TL",
        "UAH": "₴{{amount}} UAH",
        "AED": "Dhs. {{amount}} AED",
        "UYU": "${{amount_with_comma_separator}} UYU",
        "VEB": "Bs. {{amount_with_comma_separator}} VEB",
        "VND": "{{amount_no_decimals_with_comma_separator}} VND",
        "ZMK": "ZMK{{amount_no_decimals_with_comma_separator}}"
    },
    money_format : {
        "USD": "${{amount}}",
        "EUR": "€{{amount}}",
        "GBP": "£{{amount}}",
        "CAD": "${{amount}}",
        "ARS": "${{amount_with_comma_separator}}",
        "AUD": "${{amount}}",
        "BBD": "${{amount}}",
        "BDT": "Tk {{amount}}",
        "BSD": "BS${{amount}}",
        "BHD": "{{amount}}0 BHD",
        "BRL": "R$ {{amount_with_comma_separator}}",
        "BOB": "Bs{{amount_with_comma_separator}}",
        "BND": "${{amount}}",
        "BGN": "{{amount}} лв",
        "MMK": "K{{amount}}",
        "KYD": "${{amount}}",
        "CLP": "${{amount_no_decimals}}",
        "CNY": "¥{{amount}}",
        "COP": "${{amount_with_comma_separator}}",
        "CRC": "₡ {{amount_with_comma_separator}}",
        "HRK": "{{amount_with_comma_separator}} kn",
        "CZK": "{{amount_with_comma_separator}} Kč",
        "DKK": "{{amount_with_comma_separator}}",
        "DOP": "RD$ {{amount_with_comma_separator}}",
        "XCD": "${{amount}}",
        "EGP": "LE {{amount}}",
        "XPF": "{{amount_no_decimals_with_space_separator}}} XPF",
        "FJD": "${{amount}}",
        "GHS": "GH₵{{amount}}",
        "GTQ": "{{amount}}",
        "GYD": "${{amount}}",
        "GEL": "{{amount}} GEL",
        "HKD": "${{amount}}",
        "HUF": "{{amount_no_decimals_with_comma_separator}}",
        "ISK": "{{amount_no_decimals}} kr",
        "INR": "{{amount}}",
        "IDR": "{{amount_with_comma_separator}}",
        "NIS": "{{amount}} NIS",
        "JMD": "${{amount}}",
        "JPY": "¥{{amount_no_decimals}}",
        "JOD": "{{amount}}0 JD",
        "KZT": "{{amount}} KZT",
        "KES": "KSh{{amount}}",
        "KWD": "{{amount}}0 KD",
        "LVL": "Ls {{amount}}",
        "LTL": "{{amount}} Lt",
        "MXN": "$ {{amount}}",
        "MYR": "RM{{amount}} MYR",
        "MUR": "Rs {{amount}}",
        "MDL": "{{amount}} MDL",
        "MAD": "{{amount}} dh",
        "MNT": "{{amount_no_decimals}} &#8366",
        "MZN": "{{amount}} Mt",
        "ANG": "ƒ{{amount}}",
        "NZD": "${{amount}}",
        "NGN": "₦{{amount}}",
        "NOK": "kr {{amount_with_comma_separator}}",
        "OMR": "{{amount_with_comma_separator}} OMR",
        "PKR": "Rs.{{amount}}",
        "PYG": "Gs. {{amount_no_decimals_with_comma_separator}}",
        "PEN": "S/. {{amount}}",
        "PHP": "₱{{amount}}",
        "PLN": "{{amount_with_comma_separator}} zl",
        "QAR": "QAR {{amount_with_comma_separator}}",
        "RON": "{{amount_with_comma_separator}} lei",
        "RUB": "руб{{amount_with_comma_separator}}",
        "SAR": "{{amount}} SR",
        "RSD": "{{amount}} RSD",
        "SCR": "Rs {{amount}}",
        "SGD": "${{amount}}",
        "SYP": "S£{{amount}}",
        "ZAR": "R {{amount}}",
        "KRW": "₩{{amount_no_decimals}}",
        "LKR": "Rs {{amount}}",
        "SEK": "{{amount_no_decimals}} kr",
        "CHF": "SFr. {{amount}}",
        "TWD": "${{amount}}",
        "THB": "{{amount}} ฿",
        "TZS": "{{amount}} TZS",
        "TTD": "${{amount}}",
        "TRY": "{{amount}}TL",
        "UAH": "₴{{amount}}",
        "AED": "Dhs. {{amount}}",
        "UYU": "${{amount_with_comma_separator}}",
        "VEB": "Bs. {{amount_with_comma_separator}}",
        "VND": "{{amount_no_decimals_with_comma_separator}}₫",
        "ZMK": "K{{amount_no_decimals_with_comma_separator}}"
      },
    GetCurrencyFromFormatShopify: function (format){
        Object.keys(this.money_with_currency_format).some(function(k) {
            if (this.money_with_currency_format[k] === format) {
                return k
            } else {
                return format;
            }
        });
    },
    GetSymbolFromCurrency: function (currency){
        Object.keys(this.money_format).some(function(k) {
            if (k === currency) {
                return this.money_format[k]
            } else {
                return currency;
            }
        });
    }
}
export default ShopifyMoney;

