# Android app version settings

The version settings page in the web dashboard stores one Android release in
MongoDB's `app_versions` collection. It records the user-facing version name,
the integer Android `version_code`, the Google Play listing URL, and the update
timestamp.

Configure `APP_VERSION_ADMIN_KEY` as a strong secret in the backend deployment
environment before using the page. Do not put this key in frontend environment
variables or commit it to source control. The dashboard prompts for the key
when saving and keeps it in memory only.

## API

- `GET /api/app-version` returns the public current release (or `data: null`
  before the first release is configured).
- `PUT /api/app-version` saves the release and requires the `x-admin-key`
  header to match `APP_VERSION_ADMIN_KEY`.

The write endpoint only accepts positive integer version codes and HTTPS app
listing URLs on `play.google.com`. Saving a release here does not publish an
Android build; publish the exact build to Google Play before advertising its
version code to users.
