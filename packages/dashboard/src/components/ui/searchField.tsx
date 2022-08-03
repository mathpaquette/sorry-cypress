import { Clear, Search } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField, Theme } from '@mui/material';
import React, { ChangeEvent, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export type OnSearch = (value: string) => unknown;

type SearchFieldProps = {
  onSearch: OnSearch;
  placeholder: string;
  disabled?: boolean;
};

const SearchField = ({ placeholder, onSearch, disabled }: SearchFieldProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get('search') || '';

  const setValue = (value: string) => {
    if (!value) {
      clearValue();
      return;
    }

    setSearchParams({ search: value });
    onSearch(value);
  };

  const clearValue = () => {
    searchParams.delete('search');
    setSearchParams(searchParams);
    onSearch('');
  };

  useEffect(() => {
    if (value) {
      onSearch(value);
    }
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <TextField
      fullWidth
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment
            position="end"
            style={value ? {} : { display: 'none' }}
            onClick={clearValue}
          >
            <IconButton>
              <Clear />
            </IconButton>
          </InputAdornment>
        ),
      }}
      inputProps={{
        sx: {
          pt: 0.8,
          pb: 0.8,
          width: { lg: 180 },
          transition: (theme: Theme) =>
            theme.transitions.create('width', {
              duration: theme.transitions.duration.short,
            }),
          '&:focus': {
            width: { lg: 300 },
          },
        },
      }}
      variant="outlined"
      placeholder={placeholder}
      value={value}
      onChange={handleOnChange}
      disabled={disabled}
    />
  );
};

export { SearchField };
