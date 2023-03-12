setup-protokollant
==================

Sets up the [Protokollant] release tool and makes it available in the path.


## Usage

See [action.yml](action.yml)

### With latest version

```yaml
uses: ksm2/setup-protokollant-action@v1
```

### With specific version

```yaml
uses: ksm2/setup-protokollant-action@v1
with:
  version: 0.4.0
```

## Inputs

### `version`

The Protokollant version to use. Default `"latest"`.


## Outputs

### `version`

The version of Protokollant being used.

### `path`

The absolute path to the Protokollant binary.


[Protokollant]: https://github.com/ksm2/protokollant
