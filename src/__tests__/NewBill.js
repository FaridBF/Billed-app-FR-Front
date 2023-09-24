/**
 * @jest-environment jsdom
 */

import { screen } from '@testing-library/dom';
import NewBillUI from '../views/NewBillUI.js';

describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page', () => {
    test('Then a form element should be present', () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      const formElement = screen.getByTestId('form-new-bill');
      expect(formElement).toBeTruthy();
    });
  });

  describe('When I am on NewBill page, there is a form', () => {
    test('Then, all the form input should be render correctly', () => {
      document.body.innerHTML = NewBillUI();
      const formNewBill = screen.getByTestId('form-new-bill');
      const expenseType = screen.getAllByTestId('expense-type');
      const expenseName = screen.getAllByTestId('expense-name');
      const datePicker = screen.getAllByTestId('datepicker');
      const amount = screen.getAllByTestId('amount');
      const vat = screen.getAllByTestId('vat');
      const pct = screen.getAllByTestId('pct');
      const commentary = screen.getAllByTestId('commentary');
      const file = screen.getAllByTestId('file');
      const btnSendBill = document.querySelector('#btn-send-bill');

      expect(formNewBill).toBeTruthy();
      expect(expenseType).toBeTruthy();
      expect(expenseName).toBeTruthy();
      expect(datePicker).toBeTruthy();
      expect(amount).toBeTruthy();
      expect(vat).toBeTruthy();
      expect(pct).toBeTruthy();
      expect(commentary).toBeTruthy();
      expect(file).toBeTruthy();
      expect(btnSendBill).toBeTruthy();
    });
  });
});
