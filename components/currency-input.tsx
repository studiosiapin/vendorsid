'use client';
import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';

interface CurrencyInputProps {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  name,
  value,
  onChange,
  placeholder
}) => {
  const [formData, setFormData] = useState({ totalAmount: value });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    // Hanya izinkan angka dan hapus karakter yang tidak valid
    const numericValue = value.replace(/[^0-9]/g, '');

    // Format menjadi Rupiah
    const formattedValue = formatRupiah(numericValue);

    setFormData({ ...formData, totalAmount: formattedValue });
    onChange(event);
  };

  const formatRupiah = (amount: string) => {
    const numberString = amount.replace(/[^0-9]/g, '');
    const formatted = numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return formatted ? 'Rp ' + formatted : '';
  };

  useEffect(() => {
    handleChange({ target: { value } } as React.ChangeEvent<HTMLInputElement>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <>
      <Input
        name={name}
        value={formData.totalAmount}
        onChange={handleChange}
        placeholder={placeholder}
        type="text"
        onKeyPress={(event) => {
          if (!/[0-9]/.test(event.key)) {
            event.preventDefault();
          }
        }}
      />
    </>
  );
};

export default CurrencyInput;
