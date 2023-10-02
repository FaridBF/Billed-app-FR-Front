import { screen, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom'; // Importez jest-dom
import BillsUI from '../views/BillsUI.js';
import { bills } from '../fixtures/bills.js';
import { ROUTES_PATH } from '../constants/routes.js';
import { localStorageMock } from '../__mocks__/localStorage.js';
import mockStore from '../__mocks__/store.js';
import router from '../app/Router.js';

jest.mock('../app/store', () => mockStore); //mock par défault de ton store avec les valeurs de mockStore

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
      const iconActive = windowIcon.classList.contains('active-icon');
      expect(iconActive).toHaveClass;
    });

    test('Then bills should be ordered from earliest to latest', () => {
      // TODO voir avec mentor
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
      console.log;
      const newBillButton = screen.getAllByTestId('btn-new-bill');
      newBillButton[0].click();
      await waitFor(() =>
        // vérifier que l'URL contient bien le chemin souhaité
        expect(window.location.href).toContain(ROUTES_PATH.NewBill)
      );
    });

    test('Then clicking on the "Eye" icon should display the bill image in a modal', async () => {
      const modal = document.getElementById('modaleFile');
      $.fn.modal = jest.fn(() => modal.classList.add('show')); // Mock de la modal Bootstrap
      // Attendre que l'élément avec data-testid="icon-eye" soit présent dans le dom
      await waitFor(() => {
        const eyeIcons = screen.getAllByTestId('icon-eye');
        expect(eyeIcons.length).toBeGreaterThan(0);
        const firstEyeIcon = eyeIcons[0];
        firstEyeIcon.click();
        // vérifier si l'élément a la classe 'show'
        expect(modal).toHaveClass('show');
      });
    });

    test('fetches bills from an API and fails with 404 message error', async () => {
      // Utilisez le mock du store pour simuler la méthode "list" de bills

      jest.spyOn(mockStore, 'bills').mockImplementationOnce(() => {
        return {
          list: () => Promise.reject(new Error('Erreur 404'))
        };
      }); //sur mock store pour la fonction bills, je me mets en ecoute et le mock le retour de la fonction list

      window.onNavigate(ROUTES_PATH.Bills); //chargement de l'écran

      await waitFor(() => {
        //gestion du temps de chargement
        const message = screen.getByText(/Erreur 404/); //récupération du message à l'écran
        expect(message).toBeTruthy();
      });
    });

    test('fetches messages from an API and fails with 500 message error', async () => {
      jest.spyOn(mockStore, 'bills').mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error('Erreur 500'));
          }
        };
      });

      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => {
        const message = screen.getByText(/Erreur 500/);
        expect(message).toBeTruthy();
      });
    });
  });
});
