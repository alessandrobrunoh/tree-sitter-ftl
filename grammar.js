module.exports = grammar({
  name: 'ftl',

  extras: $ => [
    $.line_comment,
    $.block_comment,
    /\s/
  ],

  conflict: $ => [
    [$.tag_layout_start, $.tag_layout_end]
  ],

  rules: {
    source_file: $ => repeat($._definition),

    // Comments are handled in extras
    line_comment: $ => token(seq('<#--', /.*/, '-->')),

    block_comment: $ => token(seq(
      '/*',
      /[^*]*\*+([^/*][^*]*\*+)*/,
      '/'
    )),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    html_tag: $ => seq(
      '<',
        $.tag_name,
        optional(repeat($.tag_attributes)),
      '>'
    ),

    tag_name: $ => seq(
      choice(
        $.tag_custom,
        $.identifier,
      )
    ),

    tag_custom: $ => seq(
      choice(
        "@",
        "#"
      ),
      repeat($.identifier),
      choice(
        seq(
          $.string_literal,
          $.string,
          $.identifier,
        ),
        seq(
          "as ",
          $.identifier,
        )
      )
    ),

    tag_attributes: $ => seq(
        $.identifier,
        '=',
        choice(
          $.string,
          $.number,
          $.boolean,
        ),
        ";",
        "section"
      ),

    boolean: $ => choice(
      'true',
      'false'
    ),

    number: $ => choice(
      /[0-9]+/,
      /[0-9]+.[0-9]+/
    ),

    string: $ => choice(
      $.string_literal,
      $.string_interpolation
    ),

    string_literal: $ => token(seq(
      '"',
      /[^"]*/,
      '"'
    )),

    string_interpolation: $ => seq(
      '${',
        repeat($.identifier),
      '}'
    ),

    _definition: $ => choice(
      $.html_tag,
      $.tag_name,
      $.tag_attributes,
      $.string_interpolation,
      $.boolean,
      $.number,
    ),
  }
});
