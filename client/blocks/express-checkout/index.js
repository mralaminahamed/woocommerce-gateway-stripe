/* global wc_stripe_express_checkout_params */

import { PAYMENT_METHOD_EXPRESS_CHECKOUT_ELEMENT } from './constants';
import { ExpressCheckoutContainer } from './express-checkout-container';
import {
	ApplePayPreview,
	GooglePayPreview,
	StripeLinkPreview,
} from './express-button-previews';
import { loadStripe } from 'wcstripe/blocks/load-stripe';
import { getBlocksConfiguration } from 'wcstripe/blocks/utils';
import { checkPaymentMethodIsAvailable } from 'wcstripe/express-checkout/utils/check-payment-method-availability';
import { PAYMENT_METHOD_LINK } from 'wcstripe/stripe-utils/constants';

const stripePromise = loadStripe();

const supports = {
	features: getBlocksConfiguration()?.supports ?? [],
};
if ( getBlocksConfiguration().isAdmin ?? false ) {
	supports.style = getBlocksConfiguration()?.style ?? [];
}

const expressCheckoutElementsGooglePay = ( api ) => ( {
	name: PAYMENT_METHOD_EXPRESS_CHECKOUT_ELEMENT + '_googlePay',
	title: 'WooCommerce Stripe - Google Pay',
	content: (
		<ExpressCheckoutContainer
			api={ api }
			stripe={ stripePromise }
			expressPaymentMethod="googlePay"
		/>
	),
	edit: <GooglePayPreview />,
	canMakePayment: ( { cart } ) => {
		if ( ! getBlocksConfiguration()?.shouldShowExpressCheckoutButton ) {
			return false;
		}

		// eslint-disable-next-line camelcase
		if ( typeof wc_stripe_express_checkout_params === 'undefined' ) {
			return false;
		}

		return new Promise( ( resolve ) => {
			checkPaymentMethodIsAvailable( 'googlePay', api, cart, resolve );
		} );
	},
	paymentMethodId: PAYMENT_METHOD_EXPRESS_CHECKOUT_ELEMENT,
	gatewayId: 'stripe',
	supports,
} );

const expressCheckoutElementsApplePay = ( api ) => ( {
	name: PAYMENT_METHOD_EXPRESS_CHECKOUT_ELEMENT + '_applePay',
	title: 'WooCommerce Stripe - Apple Pay',
	content: (
		<ExpressCheckoutContainer
			api={ api }
			stripe={ stripePromise }
			expressPaymentMethod="applePay"
		/>
	),
	edit: <ApplePayPreview />,
	canMakePayment: ( { cart } ) => {
		if ( ! getBlocksConfiguration()?.shouldShowExpressCheckoutButton ) {
			return false;
		}

		// eslint-disable-next-line camelcase
		if ( typeof wc_stripe_express_checkout_params === 'undefined' ) {
			return false;
		}

		return new Promise( ( resolve ) => {
			checkPaymentMethodIsAvailable( 'applePay', api, cart, resolve );
		} );
	},
	paymentMethodId: PAYMENT_METHOD_EXPRESS_CHECKOUT_ELEMENT,
	gatewayId: 'stripe',
	supports,
} );

const expressCheckoutElementsStripeLink = ( api ) => ( {
	name: PAYMENT_METHOD_EXPRESS_CHECKOUT_ELEMENT + '_link',
	content: (
		<ExpressCheckoutContainer
			api={ api }
			stripe={ stripePromise }
			expressPaymentMethod="link"
		/>
	),
	edit: <StripeLinkPreview />,
	canMakePayment: ( { cart } ) => {
		if ( ! getBlocksConfiguration()?.shouldShowExpressCheckoutButton ) {
			return false;
		}

		// eslint-disable-next-line camelcase
		if ( typeof wc_stripe_express_checkout_params === 'undefined' ) {
			return false;
		}

		return new Promise( ( resolve ) => {
			checkPaymentMethodIsAvailable(
				PAYMENT_METHOD_LINK,
				api,
				cart,
				resolve
			);
		} );
	},
	paymentMethodId: PAYMENT_METHOD_EXPRESS_CHECKOUT_ELEMENT,
	supports,
} );

export {
	expressCheckoutElementsGooglePay,
	expressCheckoutElementsApplePay,
	expressCheckoutElementsStripeLink,
};
