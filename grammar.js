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

    field_declaration: $ => seq(
      $.identifier,
      ':',
      $.identifier
    ),

    entity_body: $ => seq(
      '{',
      optional(repeat($.field_declaration)),
      '}'
    ),

    // Entity declaration
    entity_declaration: $ => seq(
      'entity',
      $.identifier,
      optional($.entity_body)
    ),

    html_tag: $ => seq(
      '<',
      optional(choice(
        $.identifier,
        repeat1($.field_declaration)
      )),
      '>'
    ),

    variable: $ => seq(
      '${',
        $.variable_declaration,
      '}'
    ),

    variable_declaration: $ => seq(
      $.identifier
    ),

    _definition: $ => choice(
      $.entity_declaration,
      $.html_tag,
      $.variable
    ),
  }
});

// Helper function for comma-separated lists
function sep1(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)));
}
