import { coreConfig } from '../config';

export default coreConfig({
	dtsBanner: `declare global {
  interface HTMLElementTagNameMap {
    'neo-confetti': HTMLNeoConfettiElement
  }
}`,
});
