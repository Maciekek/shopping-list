import * as React from 'react';
import {
  Html,
  Button,
  Text,
  Container,
  Head,
  Heading,
  Font,
  Tailwind,
  Body
} from '@react-email/components';

export function SharedListNotifyEmail({ listUrl, from }: {
  listUrl: string,
  from: string,
}) {

  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              brand: '#007291'
            }
          }
        }
      }}
    >
      <Html lang="en">
        <Head>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
              format: 'woff2'
            }}
            fontWeight={400}
            fontStyle="normal"
          />
          <title>Someone has shared list with you!</title>
        </Head>
        <Body>


          <div className="mx-auto max-w-xl p-8 border-solid rounded-md border  border-slate-800">
            <div className="flex items-center justify-center mb-6"></div>
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
              Shopping list is shared with you
            </h1>
            <p className="text-center text-gray-600 mb-10 flex items-center">
              <h2
                className={'text-xl font-bold text-center text-gray-800 mb-4'}
              >
                Hello,{' '}
              </h2>
              <p className={'text-center'}>We would like to inform you, that</p>
              <p className={'text-center'}>
                <strong>{from}</strong>
              </p>
              <p className={'text-center'}>has shared the shopping list with you</p>
            </p>
            <div className="mb-6 w-full text-center">
              <Button>
                <a href={listUrl}>
                <div
                  className={
                    'inline-flex bg-black text-white rounded-md text-sm font-medium cursor-pointer leading-10 h-10 px-4'
                  }
                >
                  Click here to see the list
                </div>
                </a>
              </Button>

            </div>
            {/*<footer className="text-center text-gray-600">*/}
            {/*  If you have any issues, please contact our support team at*/}
            {/*  support@example.com or call us at (123) 456-7890.*/}
            {/*</footer>*/}
          </div>
        </Body>
      </Html>
    </Tailwind>
  );
}

export default SharedListNotifyEmail;
