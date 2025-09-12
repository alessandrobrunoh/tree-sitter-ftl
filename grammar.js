module.exports = grammar({
  name: 'ftl',

  extras: $ => [
    $.line_comment,
    $.block_comment,
    /\s/
  ],

  rules: {
    source_file: $ => repeat($._definition),

    // Comments are handled in extras
    line_comment: $ => token(seq('//', /.*/)),

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
        $.tag_import,
        $.identifier,
      )
    ),

    tag_import: $ => seq(
      '#import ',
      $.string_literal,
      ' as ',
      $.identifier
    ),

    tag_attributes: $ => seq(
        $.identifier,
        '=',
        $.string
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

    // conflict: $ => [
    //   [$.tag_name, $.variable_declaration]
    // ],

    _definition: $ => choice(
      $.html_tag,
      $.tag_name,
      $.tag_attributes,
      $.string_interpolation
    ),
  }
});

// Helper function for comma-separated lists
function sep1(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)));
}
