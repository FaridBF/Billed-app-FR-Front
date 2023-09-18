import { screen, waitFor } from '@testing-library/dom';
import BillsUI from '../views/BillsUI.js';
import { bills } from '../fixtures/bills.js';
import { ROUTES_PATH } from '../constants/routes.js';
import { localStorageMock } from '../__mocks__/localStorage.js';
import router from '../app/Router.js';

describe('Given I am connected as an employee', () => {
  describe('When I am on Bills Page', () => {
    beforeEach(() => {
      // Configuration commune à tous les tests de cette section
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
        writable: true
      });
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          type: 'Employee'
        })
      );
      const root = document.createElement('div');
      root.setAttribute('id', 'root');
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
    });

    test('Then bill icon in vertical layout should be highlighted', async () => {
      await waitFor(() => screen.getByTestId('icon-window'));
      const windowIcon = screen.getByTestId('icon-window');
      expect(windowIcon.className).toEqual('active-icon');
    });

    test('Then bills should be ordered from earliest to latest', () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });

    test('Then clicking on the "New Bill" button should navigate to the New Bill page', async () => {
      const newBillButton = screen.getByTestId('btn-new-bill');
      newBillButton.click();
      await waitFor(() =>
        // vérifier que l'URL contient bien le chemin souhaité
        expect(window.location.href).toContain(ROUTES_PATH.NewBill)
      );
    });

    test('Then clicking on the "Eye" icon should display the bill image in a modal', async () => {
      const eyeIcons = screen.getAllByTestId('icon-eye');
      const firstEyeIcon = eyeIcons[0];
      firstEyeIcon.click();
      //wait for permet d'attendre que la modale soit rendue dans le DOM
      await waitFor(() => {
        const modal = screen.getByRole('dialog');
        expect(modal).toBeTruthy();
      });
    });
  });
});
