[![Build Status](https://cloud.drone.io/api/badges/rpiambulance/person-v1/status.svg)](https://cloud.drone.io/rpiambulance/person-v1)

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)

# RPIAlert

**RPIAlert** queries RPI's alerting system and provides notification to Slack.

Every 10 seconds, the integration checks to see if there's a new alert; if there is, it checks it against the last one, and if they're different, it sends it to #alerts.

## Credits

### Developers

- [Dan Bruce](https://github.com/ddbruce)

### License

**RPIAlert** is provided under the [MIT License](https://opensource.org/licenses/MIT).

### Contact

For any question, comments, or concerns, email [dev@rpiambulance.com](mailto:dev@rpiambulance.com), [create an issue](https://github.com/rpiambulance/rpialert/issues/new), or open up a pull request.
