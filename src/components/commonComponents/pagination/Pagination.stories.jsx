/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react';

import Pagination from './Pagination';

export default {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    totalRecords: { control: 'number' },
    totalPages: { control: 'number' },
    currentPage: { control: 'number' },
    currentLimit: { control: 'number' },
  },
};

export const Default = {
  render: () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    return (
      <Pagination
        totalRecords={52}
        totalPages={6}
        currentPage={page}
        currentLimit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />
    );
  },
};

export const ManyPages = {
  render: () => {
    const [page, setPage] = useState(5);
    const [limit, setLimit] = useState(10);
    return (
      <Pagination
        totalRecords={250}
        totalPages={25}
        currentPage={page}
        currentLimit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />
    );
  },
};

export const FirstPage = {
  render: () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    return (
      <Pagination
        totalRecords={100}
        totalPages={10}
        currentPage={page}
        currentLimit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />
    );
  },
};

export const LastPage = {
  render: () => {
    const [page, setPage] = useState(10);
    const [limit, setLimit] = useState(10);
    return (
      <Pagination
        totalRecords={100}
        totalPages={10}
        currentPage={page}
        currentLimit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />
    );
  },
};

export const FewPages = {
  render: () => {
    const [page, setPage] = useState(2);
    const [limit, setLimit] = useState(10);
    return (
      <Pagination
        totalRecords={30}
        totalPages={3}
        currentPage={page}
        currentLimit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />
    );
  },
};
