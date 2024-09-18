import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CurrencyExchange = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('VND');
  const [amount, setAmount] = useState(1);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);

  const API_KEY = '20ce283b894970c762b78c54c73b8d70'; // API key của bạn

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(`http://data.fixer.io/api/latest?access_key=${API_KEY}`);
        setCurrencies(Object.keys(response.data.rates));
        setExchangeRate(response.data.rates[toCurrency]);
      } catch (error) {
        console.error('Error fetching currencies', error);
      }
    };
    fetchCurrencies();
  }, []);

  // Cập nhật tỷ giá và số tiền quy đổi mỗi khi thay đổi loại tiền hoặc số tiền
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get(
          `http://data.fixer.io/api/latest?access_key=${API_KEY}&symbols=${fromCurrency},${toCurrency}`
        );
        const rate = response.data.rates[toCurrency] / response.data.rates[fromCurrency];
        setExchangeRate(rate);
        setConvertedAmount(Math.floor(amount * rate).toLocaleString('de-DE')); // Làm tròn số nguyên
      } catch (error) {
        console.error('Error fetching exchange rate', error);
      }
    };
    if (fromCurrency && toCurrency) {
      fetchExchangeRate();
    }
  }, [fromCurrency, toCurrency, amount]);

  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  return (
    <div style={{ margin: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2>Currency Exchange</h2>
      <div>
        <label>Số tiền:</label>
        <input type="number" value={amount} onChange={handleAmountChange} />
      </div>
      <div>
        <label>From:</label>
        <select value={fromCurrency} onChange={handleFromCurrencyChange}>
          {currencies.map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
        <label>To:</label>
        <select value={toCurrency} onChange={handleToCurrencyChange}>
          {currencies.map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
      </div>
      <div>
        <p>{amount} {fromCurrency} = {convertedAmount} {toCurrency}</p>
      </div>
    </div>
  );
};

export default CurrencyExchange;
