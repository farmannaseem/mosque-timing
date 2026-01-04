# Deployment Information

The web version of the Mosque Timing App has been successfully deployed to Netlify.

**Live URL:** [https://mosque-timing.netlify.app](https://mosque-timing.netlify.app)

## How to Update

To update the deployment with new changes:

1.  **Build the Web Version:**
    ```bash
    npm run build:web
    ```

2.  **Deploy to Production:**
    ```bash
    npx netlify-cli deploy --dir=dist --prod
    ```

## Credentials
The deployment is linked to the `mosque-timing` site on Netlify. Ensure you are logged in to the Netlify CLI if you run this on a different machine.
